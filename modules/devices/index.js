'use strict'

const {
    all: allSchema,
    create: createSchema,
    find: findSchema,
    update: updateSchema,
    del: delSchema,
} = require('./schemas')

module.exports = async function (fastify, opts) {
    fastify.get('/', allSchema, getAllHandler)
    fastify.post('/', createSchema, createHandler)
    fastify.get('/:id', findSchema, findHandler)
    fastify.put('/', updateSchema, updateHandler)
    fastify.delete('/:id', delSchema, delHandler)
}

module.exports[Symbol.for('plugin-meta')] = {
    decorators: {
        fastify: [
            'deviceService'
        ]
    }
}

async function createHandler (req, reply) {
    reply.type('application/json')
    const item = await this.deviceService.create(req.body)
    if (item === null)
    {
        reply.code(404)
    }
    return {
        message: item !== null ? 'device created' : 'fail to create device',
        status: item !== null,
        item: item
    }
}


async function getAllHandler (req, reply) {
    reply.type('application/json')
    const {total, filtered, items} = await this.deviceService.all(req.query.start, req.query.length, req.query.search)
    if (total === 0)
    {
        reply.code(404)
    }
    return {
        message: total > 0 ? 'device found' : 'no data found',
        status: total > 0,
        total: total,
        filtered: filtered,
        items: items
    }
}

async function findHandler (req, reply) {
    reply.type('application/json')
    const item = await this.deviceService.find(req.params.id)
    return {
        message: item !== null ? 'device found' : 'no data found',
        status: item !== null,
        item: item
    }
}

async function updateHandler (req, reply) {
    reply.type('application/json')
    const item = await this.deviceService.update(req.body)
    if (item === null)
    {
        reply.code(404)
    }
    return {
        message: item !== null ? 'device updated' : 'fail to update device',
        status: item !== null,
        item: item
    }
}

async function delHandler (req, reply) {
    reply.type('application/json')
    const success = await this.deviceService.del(req.params.id)
    return {
        message: success ? 'device deleted' : 'no data deleted',
        status: success
    }
}