import { Model, Sequelize } from 'sequelize-typescript'
import { logger } from '../services'
import { seqModels } from '../models'
import { server as config } from '../../../config'

export interface IOptions {
    uri: string
    seqOptions?: {
        database: string,
        username: string,
        password: string,
        port: number,
    }
}

/*
    This class was created to work with Sequelize as ORM, you can find more information
    regarding Sequelize here:
        http://docs.sequelizejs.com

    TODO: find documentation for Typescript
*/
class RDB {
    public sequelize: any | Sequelize
    public isConnected: boolean

    constructor() {
        this.isConnected = false
    }

    public async initAsync(options: IOptions) {
        if (config.environment === 'test' && options.seqOptions) {
            this.sequelize = new Sequelize({
                database: options.seqOptions.database,
                username: options.seqOptions.username,
                password: options.seqOptions.password,
                port: options.seqOptions.port,
                dialect: 'postgres',
                logging: false,
                query: { logging: false },
            })
        } else {
            this.sequelize = new Sequelize(options.uri)
        }
        try {
            await this.sequelize.addModels(seqModels)
            /*
                Authenticate is called to test connection with DB
                Errors are caught in catch block and sync() is not exceuted
            */
            await this.sequelize.authenticate()
            logger.info('RDB => Authenticated')

            if (config.environment === 'test') {
                await rdb.sequelize.sync()
                logger.info('RDB => Models synced')
            }

            this.isConnected = true
        } catch (error) {
            /*
                Here you can find all the documentation for Sequelize errors:
                http://docs.sequelizejs.com/class/lib/errors/index.js~BaseError.html
            */
            logger.error(`RDB => ${error}`)
        }
    }
}

export const rdb: RDB = new RDB()
