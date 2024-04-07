'use strict'

const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const mqtt = require('mqtt')
const chalk = require('chalk')
const SindconWaterMeter = require('./sindcon-water-meter')
const SindconWaterPressure = require('./sindcon-water-pressure')
const CybelIncometer = require('./cybel-incometer')
const LansitecTracer = require('./lansitec-tracker')
const moment = require('moment')

class Parser {
    constructor() {
        this.sequelizeConfig = fs.readFileSync(path.join(__dirname, "../../config/config.json"))
        this.sequelizeConfig = JSON.parse(this.sequelizeConfig)
        this.sequelize = new Sequelize(this.sequelizeConfig.development)

        this.deviceModel = require('../../models/device')
        this.swmMessageModel = require('../../models/swmmessage')
        this.swpMessageModel = require('../../models/swpmessage')
        this.ciMessageModel = require('../../models/cimessage')
        this.ltMessageModel = require('../../models/ltmessage')

        this.sindconWaterMeter = new SindconWaterMeter()
        this.sindconWaterPressure = new SindconWaterPressure()
        this.cybelIncometer = new CybelIncometer()
        this.lansitecTracer = new LansitecTracer()

        this.mqttOptions = fs.readFileSync(path.join(__dirname, "../../config/mqtt.json"))
        this.mqttOptions = JSON.parse(this.mqttOptions)
    }

    async connect()
    {
        try {
            await this.sequelize.authenticate()
            this.Device = this.deviceModel(this.sequelize, Sequelize.DataTypes)
            this.SwmMessage = this.swmMessageModel(this.sequelize, Sequelize.DataTypes)
            this.SwpMessage = this.swpMessageModel(this.sequelize, Sequelize.DataTypes)
            this.CiMessage = this.ciMessageModel(this.sequelize, Sequelize.DataTypes)
            this.LtMessage = this.ltMessageModel(this.sequelize, Sequelize.DataTypes)

            console.log(chalk.green('Connection has been established successfully.'))
        } catch (error) {
            console.log(chalk.red('Unable to connect to the database:'), error)
        }
    }

    async run()
    {
        const _this = this
        this.connect().then(function () {
            _this.mqttClient  = mqtt.connect(_this.mqttOptions.host, _this.mqttOptions)
            _this.mqttClient.on('connect', async function () {
                console.log(chalk.yellow('subscribing to all except $'))
                _this.mqttClient.subscribe('#', function (err) {
                    if (err) console.log(chalk.red(err))
                })
            })

            _this.mqttClient.on('message', async function (topic, message) {
                console.log(chalk.cyanBright("incoming message"))
                console.log(chalk.cyanBright(topic))
                console.log(chalk.magentaBright(message))

                if (topic === '/polaris/system/subscribe') {
                    const address = String(message)
                    console.log(chalk.yellow('new device '), address)
                } else if (topic === '/polaris/system/unsubscribe') {
                    const address = String(message)
                    console.log(chalk.yellow('removing device '), address)
                } else {
                    const obj = JSON.parse(String(message).replaceAll("\\", ""))
                    const base64 = obj.payload
                    const buffer = Buffer.from(base64, 'base64');

                    const payload = buffer.toString('hex');
                    //let i = msg.hasOwnProperty('end_device_id')
                    let endDeviceId = obj.end_device_id
                    console.log("end_device_id", endDeviceId)

                    //i = msg.indexOf("payload", i)
                    /*console.log("payload", payload)

                    const raw = atob(payload);
                    payload = '';
                    for (let i = 0; i < raw.length; i++) {
                        const hex = raw.charCodeAt(i).toString(16);
                        payload += (hex.length === 2 ? hex : '0' + hex);
                    }*/

                    console.log("payload", chalk.yellow(payload))

                    const devices = await _this.Device.findAll()
                    console.log(devices.length)
                    for (let i = 0; i < devices.length; i++) {
                        const device = devices[i]
                        console.log(chalk.yellow(device.address), '?', (endDeviceId === device.address))
                        if (endDeviceId === device.address) {
                            if (device.model === 'swm') {
                                _this.sindconWaterMeter.parse(endDeviceId, payload).then(function (message) {
                                    message.deviceId = device.id
                                    _this.SwmMessage.create(message)
                                }).catch(function (error) {
                                    console.log(chalk.red(error))
                                })
                                console.log(chalk.cyanBright("parsed"))
                            } else if (device.model === 'swp') {
                                _this.sindconWaterPressure.parse(endDeviceId, payload).then(function (message) {
                                    message.deviceId = device.id
                                    _this.SwpMessage.create(message)
                                }).catch(function (error) {
                                    console.log(chalk.red(error))
                                })
                                console.log(chalk.cyanBright("parsed"))
                            } else if (device.model === 'ci') {
                                _this.cybelIncometer.parse(endDeviceId, payload).then(function (message) {
                                    message.deviceId = device.id
                                    _this.CiMessage.create(message)
                                }).catch(function (error) {
                                    console.log(chalk.red(error))
                                })
                                console.log(chalk.cyanBright("parsed"))
                            } else if (device.model === 'lt') {
                                _this.lansitecTracer.parse(endDeviceId, payload).then(function (message) {
                                    message.deviceId = device.id
                                    _this.LtMessage.create(message)
                                }).catch(function (error) {
                                    console.log(chalk.red(error))
                                })
                                console.log(chalk.cyanBright("parsed"))
                            }
                            device.lastData = moment().toDate()
                            await device.save()
                        }
                    }
                }

            })
        }).catch(function (error) {
            console.log(chalk.red(error))
        })

    }

    reconnect()
    {
        this.mqttClient.end()
        this.mqttClient  = mqtt.connect(this.mqttOptions.host, this.mqttOptions)
    }
}

const parser = new Parser()
parser.run().then(function (){
    console.log(chalk.bgWhite("running"))
}).catch(function (error) {
    console.log(chalk.red(error))
})
