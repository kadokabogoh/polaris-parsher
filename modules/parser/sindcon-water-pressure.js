'use strict'

const chalk = require('chalk')
const moment = require('moment')

class SindconWaterPressure {
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
            waterPressure: 0,
            batteryVoltage: 0,
            boardTemperature: 0,
            busVoltage: 0
        }

        let waterPressure = payload.substr(4, 8)
        message.waterPressure = parseInt(waterPressure, 16) / 1e5

        let boardTemperature  = payload.substr(16, 4)
        message.boardTemperature  = parseInt(boardTemperature, 16) / 10

        let batteryVoltage = payload.substr(24, 4)
        message.batteryVoltage = parseInt(batteryVoltage, 16) / 100

        /*if (payload.length === 12)
        {
            let busVoltage  = payload.substr(4, 4)
            message.busVoltage  = parseInt(busVoltage, 16) / 1e4


        } else {
            let boardTemperature  = payload.substr(4, 4)
            message.boardTemperature  = parseInt(boardTemperature, 16) / 1e3

            let busVoltage  = payload.substr(4, 8)
            message.busVoltage  = parseInt(busVoltage, 16) / 1e4
        }*/

        console.log(chalk.white("writing new data"))
        console.log(chalk.blue(JSON.stringify(message)))
        return message
    }
}

module.exports = SindconWaterPressure