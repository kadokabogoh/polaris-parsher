'use strict'

const chalk = require('chalk')
const moment = require('moment')

class DjUltrasonicWaterMeter {
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
        if (payload.startsWith("81"))
        {
            console.log(chalk.greenBright(`processing ${payload}`))
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
            if (payload.length > 12)
            {
                let meterReading = payload.substring(12, 20)
                meterReading = meterReading.match(/[a-fA-F0-9]{2}/g).reverse().join('')
                meterReading = parseInt(meterReading)
                message.meterReading = meterReading/1000
                let valveStatus = payload.substring(21, 22)
                if (valveStatus == "00")
                {
                    message.valveStatus = "1"
                }
                else if ( valveStatus == "01")
                {
                    message.valveStatus = "0"
                }
                else 
                {
                    message.valveStatus = "2"
                }
                let batteryStatus = payload.substring(25, 26)
                batteryStatus = parseInt(batteryStatus)
                message.batteryStatus = (batteryStatus/255)*100                
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

module.exports = DjUltrasonicWaterMeter