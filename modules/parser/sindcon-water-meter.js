'use strict'

const chalk = require('chalk')
const moment = require('moment')

class SindconWaterMeter {
    hexToBin(hex, bytes)
    {
        let bin = parseInt(hex, 16).toString(2)
        if (bin.length < bytes)
        {
            bin = bin.padStart(bytes, "0")
        }
        return bin
    }

    uintToInt(uint, nbit) {
        nbit = +nbit || 32;
        if (nbit > 32) throw new RangeError('uintToInt only supports ints up to 32 bits');
        uint <<= 32 - nbit;
        uint >>= 32 - nbit;
        return uint;
    }

    async parse(topic, param)
    {
        let payload = String(param)
        if (payload.startsWith("{"))
        {
            payload = JSON.parse(payload)
            payload = payload.payload
        }
        if (payload.startsWith("08"))
        {
            console.log(chalk.greenBright(`processing ${payload}`))
            let index = 0
            const message = {
                device: topic,
                alarm: false,
                alarmReboot: false,
                alarmBatteryLow: false,
                alarmNoRepayment: false,
                alarmSteal: false,
                alarmValveClosed: false,
                alarmNoSignal: false,
                alarmValveFault: false,
                batteryStatus: null,
                valveStatus: null,
                pulseUnit: null,
                meterReading: null,
                meterTime: null,
                battery: null,
                deviceType: null,
                sofwareVersion: null,
                rssi: null,
                snr: null
            }
            while (index < payload.length)
            {
                let type = payload.substr(index, 2)
                type = this.hexToBin(type, 4)
                type = type.substr(0, type.length - 2)
                type = parseInt(type, 2)
                index+=2
                switch (type)
                {
                    case 0:
                        let devicePrimaryType = payload.substr(index, 4)
                        devicePrimaryType = this.hexToBin(devicePrimaryType, 4)
                        devicePrimaryType = parseInt(devicePrimaryType, 2)
                        index+=4

                        let deviceExtensionType = payload.substr(index, 4)
                        deviceExtensionType = this.hexToBin(deviceExtensionType, 4)
                        deviceExtensionType = parseInt(deviceExtensionType, 2)
                        index+=4

                        let hardwareVersion = payload.substr(index, 2)
                        hardwareVersion = this.hexToBin(hardwareVersion, 4)
                        const hardwareMajorVersion = parseInt(hardwareVersion.substr(0, 2), 2)
                        const hardwareMinorVersion = parseInt(hardwareVersion.substr(2, 4), 2)
                        index+=8

                        message.deviceType = devicePrimaryType
                        message.sofwareVersion = `${deviceExtensionType}.${hardwareMajorVersion}.${hardwareMinorVersion}`

                        break;

                    case 1:
                        let meterReading = payload.substr(index, 8)
                        index+=8
                        meterReading = parseInt(meterReading, 16).toString()
                        meterReading = `${meterReading.substr(0, meterReading.length - 3)}.${meterReading.substr(meterReading.length - 3, 3)}`
                        message.meterReading = meterReading
                        break;

                    case 2:
                        let alarm = payload.substr(index, 2)
                        index+=2
                        alarm = this.hexToBin(alarm, 8)
                        const keys = ['alarmValveFault', 'alarmNoSignal', 'alarmValveClosed', 'alarmSteal', 'alarmNoRepayment', 'alarmBatteryLow', 'alarmReboot']
                        for (let i = 0; i < keys.length; i++)
                        {
                            if (alarm.charAt(i + 1) === '1')
                            {
                                message.alarm = true
                                message[keys[i]] = true
                            }
                        }

                        break;

                    case 3:
                        let status = payload.substr(index, 2)
                        status = this.hexToBin(status, 8)
                        message.valveStatus = status.charAt(0) === '1'
                        const batteryStatus = status.substr(1, 7)
                        message.batteryStatus = parseInt(batteryStatus, 2)
                        index+=2
                        break;

                    case 4:
                        index+=8
                        break;

                    case 5:
                        index+=8
                        break;

                    case 10:
                        let meterTime = payload.substr(index, 8)
                        meterTime = parseInt(meterTime, 16)
                        message.meterTime = moment.unix(meterTime).format('YYYY-MM-DD HH:mm:ss')

                        index+=8

                        break;

                    case 13:
                        let pulseUnit = payload.substr(index, 4)
                        pulseUnit = parseInt(pulseUnit, 16)
                        message.pulseUnit = pulseUnit
                        index+=4
                        break;

                    case 15:
                        let rebootCount = payload.substr(index, 8)
                        rebootCount = parseInt(rebootCount, 16)
                        index+=8
                        break;

                    case 16:
                        let battery = payload.substr(index, 2)
                        battery = parseInt(battery, 16)
                        index+=2
                        break;

                    case 20:
                        let rssi = payload.substr(index, 4)
                        rssi = parseInt(rssi, 16)
                        message.rssi = this.uintToInt(rssi, 10)
                        index+=4
                        let snr = payload.substr(index, 2)
                        message.snr = parseInt(snr, 16)
                        index+=4
                        break;

                    case 30:
                        let flags = payload.substr(index, 8)
                        flags = `0x${flags.substr(2, 6)}`
                        index+=8
                        break;
                }
            }

            console.log(chalk.white("writing new data"))
            console.log(chalk.blue(JSON.stringify(message)))
            return message
        } else
        {
            console.log(chalk.yellow('cannot parse '), chalk.yellow(payload))
            throw Error(`cannot parse ${payload}`)
        }
    }
}

module.exports = SindconWaterMeter