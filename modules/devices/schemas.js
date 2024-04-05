'use strict'

const all = {
    schema: {
        description: 'get all devices',
        tags: ['Device'],
        summary: 'get all devices',
        querystring: {
            start: {type: 'integer'},
            length: {type: 'integer'},
            search: {type: 'string'},
        },
        response: {
            201: {
                description: 'Succesful response',
                type: 'object',
                properties: {
                    status: {type: 'boolean'},
                    message: {type: 'string'},
                    total: {type: 'integer'},
                    items: {type: 'array'},
                }
            }
        }
    }
}

const find = {
    schema: {
        description: 'find device by id',
        tags: ['Device'],
        summary: 'find device by id',
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: {
                    type: 'integer'
                }
            }
        },
        response: {
            201: {
                description: 'Succesful response',
                type: 'object',
                properties: {
                    status: {type: 'boolean'},
                    message: {type: 'string'},
                    item: {type: 'object'},
                }
            }
        }
    }
}

const create = {
    schema: {
        description: 'create a new device',
        tags: ['Device'],
        summary: 'create a new device',
        body: {
            type: 'object',
            required: [ 'name', 'address', 'model' ],
            properties: { name: {type: 'string'}, address: {type: 'string'}, model: {type: 'string'}},
            additionalProperties: false
        },
        response: {
            201: {
                description: 'Succesful response',
                type: 'object',
                properties: {
                    status: {type: 'boolean'},
                    message: {type: 'string'},
                    item: {type: 'object'},
                }
            }
        }
    }
}

const update = {
    schema: {
        description: 'update a device',
        tags: ['Device'],
        summary: 'update device',
        body: {
            type: 'object',
            required: [ 'id', 'name', 'address', 'model' ],
            properties: { id: {type: 'integer'}, name: {type: 'string'}, address: {type: 'string'}, model: {type: 'string'}},
            additionalProperties: false
        },
        response: {
            201: {
                description: 'Succesful response',
                type: 'object',
                properties: {
                    status: {type: 'boolean'},
                    message: {type: 'string'},
                    item: {type: 'object'},
                }
            }
        }
    }
}

const del = {
    schema: {
        description: 'delete device by id',
        tags: ['Device'],
        summary: 'delete device by id',
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: {
                    type: 'integer'
                }
            }
        },
        response: {
            201: {
                description: 'Succesful response',
                type: 'object',
                properties: {
                    status: {type: 'boolean'},
                    message: {type: 'string'}
                }
            }
        }
    }
}

module.exports = {
    all,
    create,
    find,
    update,
    del
}