'use strict'

const chalk = require('chalk')
const moment = require('moment')

class CybelIncometer {
    async parse(topic, param)
    {
        let payload = String(param)
        if (payload.startsWith("{"))
        {
            payload = JSON.parse(payload)
            payload = payload.payload
        }
        console.log(chalk.greenBright(`processing ${payload}`))
        const message = {
            device: topic,
            meterNumber: '',
            forwardFlow: 0,
            reverseFlow: 0,
            unit: 0,
            meterTime: 0,
            statusByte: 0,
            batteryVoltage: 0,
            checkCode: 0
        }
        let meterNumber = ""
        for (let k = 12; k > 2; k-=2)
        {
            meterNumber += payload.substring(k - 2, k)
        }
        message.meterNumber = meterNumber

        message.forwardFlow = this.getReverseDecimal(payload, 16, 24, 3)
        message.reverseFlow = this.getReverseDecimal(payload, 24, 32, 3)

        let unit = ""
        for (let k = 32; k < 34; k+=2)
        {
            unit += payload.substring(k, k + 2)
        }
        message.unit = unit
        message.meterTime = this.getTimestamp(payload)

        let statusByte = ""
        for (let k = 48; k < 54; k+=2)
        {
            statusByte += payload.substring(k, k + 2)
        }
        message.statusByte = statusByte

        message.batteryVoltage = this.getForwardDecimal(payload, 54, 56, 1)
        let checkCode = ""
        for (let k = 56; k < 58; k+=2)
        {
            checkCode += payload.substring(k, k + 2)
        }
        message.checkCode = checkCode

        console.log(chalk.white("writing new data"))
        console.log(chalk.blue(JSON.stringify(message)))
        return message
    }

    bcdToDec(val)
    {
        return( (val/16*10) + (val%16) )
    }

    getForwardDecimal(payload, start, end, precision)
    {
        let temp = ""
        for (let k = start; k < end; k+=2)
        {
            temp += `${parseInt(payload.substring(k, k + 2), 16)}`
        }
        const idx = temp.length - precision
        temp = `${temp.slice(0, idx)}.${temp.slice(idx, temp.length)}`
        return parseFloat(temp)
    }

    getReverseDecimal(payload, start, end, precision)
    {
        let temp = ""
        for (let k = end; k > start; k-=2)
        {
            temp += `${payload.substring(k - 2, k)}`
        }
        temp = `${parseInt(temp, 16)}`
        const idx = temp.length - precision
        temp = `${temp.slice(0, idx)}.${temp.slice(idx, temp.length)}`
        return parseFloat(temp)
    }

    getTimestamp(payload)
    {
        let second = ''
        for (let l = 34; l < 36; l+=2)
        {
            second += payload.substring(l, l + 2)
        }
        second = parseInt(second, 16)

        let minute = ''
        for (let l = 36; l < 38; l+=2)
        {
            minute += payload.substring(l, l + 2)
        }
        minute = parseInt(minute, 16)

        let hour = ''
        for (let l = 38; l < 40; l+=2)
        {
            hour += payload.substring(l, l + 2)
        }
        hour = parseInt(hour, 16)

        let day = ''
        for (let l = 40; l < 42; l+=2)
        {
            day += payload.substring(l, l + 2)
        }
        day = parseInt(day, 16)

        let month = ''
        for (let l = 42; l < 44; l+=2)
        {
            month += payload.substring(l, l + 2)
        }
        month = parseInt(month, 16)

        let year = ''
        for (let l = 48; l > 44; l-=2)
        {
            year += payload.substring(l - 2, l)
        }
        year = parseInt(year, 16)

        return moment(`${year}-${month}-${day} ${hour}:${minute}:${second} +0000`, 'YYYY-M-D H:m:s Z').toDate()
    }
}

module.exports = CybelIncometer