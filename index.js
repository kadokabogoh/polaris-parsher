// Require the framework and instantiate it
const fastify = require('fastify')()
const fp = require('fastify-plugin')
const fastifyEnv = require('fastify-env')
const chalk = require('chalk')

const DeviceService = require('./modules/devices/service')

const schema = {
    type: 'object',
    required: ['DB_NAME', 'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_PORT', 'APP_PORT'],
    properties: {
        DB_NAME: {
            type: 'string',
            default: 'polaris_api_v2'
	},
        DB_HOST: {
            type: 'string',
            default: 'localhost'
        },
        DB_USER: {
            type: 'string',
            //default: 'postgres'
            default: 'lora'
        },
        DB_PASS: {
            type: 'string',
            //default: 'pdam2021'
            default: 'PDAM2021!'
        },
        DB_PORT: {
            type: 'string',
            //default: 5432
            default: 53306
        },
        APP_PORT: {
            type: 'string',
            default: 3020
        },
    }
}

const options = {
    confKey: 'config', // optional, default: 'config'
    schema: schema,
}

async function decorateFastifyInstance(fastify) {

    const deviceService = new DeviceService(fastify)

    fastify.decorate('deviceService', deviceService)
}

async function main() {
    fastify.register(fastifyEnv, options)
    await fastify.after(() => {
        console.log(fastify.config)
    })
    fastify.register(require('sequelize-fastify'),
        {
            instance: 'db',
            sequelizeOptions: {
                database: fastify.config.DB_NAME,
                dialect: 'mariadb',
                //dialect: 'postgres',
                host: fastify.config.DB_HOST,
                username: fastify.config.DB_USER,
                password: fastify.config.DB_PASS,
                port: fastify.config.DB_PORT,
                dialectOptions: {
                    options: {
                        requestTimeout: 300000
                    }
                }
            }
        })
    await fastify.after(() => {
        fastify.db.authenticate()
    })
    fastify.register(fp(decorateFastifyInstance))
    fastify.register(require('./modules/devices'), {prefix: '/devices'})

    await fastify.ready().then(() => {
        fastify.listen(fastify.config.APP_PORT, '0.0.0.0', () => {
            console.log(
                chalk.bgYellow(
                    chalk.black(`Fastify server is running on port: ${fastify.config.APP_PORT}`)
                )
            )
        })
    }, (err) => {
        console.log('an error happened', err)
    })

}

main().then(value => {
    chalk.bgYellow(
        chalk.black(`Server running`)
    )
})
