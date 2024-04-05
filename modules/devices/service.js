'use strict'

const Sequelize = require('sequelize')
const deviceModel = require('../../models/device')

class DeviceService {
    constructor(fastify) {
        this.Device = deviceModel(fastify.db, Sequelize.DataTypes)
    }

    async all (start, length, search) {
        const criteria = {
            'where': {
                'name': { [Sequelize.Op.like]: `%${search}%`}
            },
            'order': [['id']]
        }
        const items = await this.Device.findAll(criteria)
        const total = await this.Device.count()
        const filtered = await this.Device.count(criteria)
        return {
            total: total,
            filtered: filtered,
            items: items
        }
    }

    async find (id) {
        return await this.Device.findByPk(id)
    }

    async create(body)
    {
        return this.Device.create({
            name: body.name,
            address: body.address,
            model: body.model
        });
    }

    async update(body)
    {
        const item = await this.Device.findByPk(body.id)
        item.name = body.name
        item.address = body.address
        item.model = body.model
        await item.save()
        return item
    }

    async del(id)
    {
        const item = await this.Device.findByPk(id)
        if (item !== null)
        {
            await item.destroy()
            return true
        }
        return false
    }

}

module.exports = DeviceService