import { logger } from './wLogger'
import { redisCache, ClientParams } from './redisCache'
import { rdb, IOptions as RDBOptions } from './rdb'
import { mongodb, IOptions as MongoOpt } from './mongoDB'
import * as config from '../../../config'
import { ISequelizeConfig } from 'sequelize-typescript'

export  function initExternalServices() {

    /*
        Initializing Redis instance for auth token hosting
    */
    const redisOpt: ClientParams = {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
    }

    redisCache.init(redisOpt)

    /*
        Initializing APN (Apple Push Notifications Service)
        We are using .p8 configuration instead of .pem and .cer
    */
    // const apnOpt: APNOptions = {
    //     p8FilePath: config.apn.p8FilePath,
    //     keyId: config.apn.keyId,
    //     teamId: config.apn.teamId,
    //     release: config.apn.release,
    //     bundleIdentifier: config.apn.bundleIdentifier,
    // }

    // apn.init(apnOpt)

    /*
        Initializing relational Database Connection
        Sequelize used as ORM
        TODO: Docker
    */
    const rdbOpt: RDBOptions = {
        uri : config.rdb.getConnectionString(),
    }

    rdb.initAsync(rdbOpt)

    /*
        Initializing MongoDB (non-relational) Database Connection
        Mongoose used as ODM
        TODO: Docker
    */
    // const mongodbOpt: MongoOpt = {
    //     uri : config.mongodb.getConnectionString(),
    //     mongoOptions : { useMongoClient: true },
    // }

    // mongodb.initAsync(mongodbOpt)
}

/*
    We use Winston for logging
    defined levels are: error and info
    TODO: expand levels
*/
export function initWLogger() {
    const logLevel = config.wLogger.isValid ? config.wLogger.level : 'info'
    logger.init(logLevel)
}

export { logger, redisCache, rdb, mongodb }
