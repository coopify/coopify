import { googleAuth } from "./googleAuthentication";
import { logger } from './wLogger'
import { redisCache, ClientParams } from './redisCache'
import { rdb, IOptions as RDBOptions } from './rdb'
import * as config from '../../../config'
import { FacebookService } from './facebook'

let facebook: FacebookService

export  function initExternalServices() {

    facebook = new FacebookService(config.facebook)
    /*
        Initializing Redis instance for auth token hosting
    */
    const redisOpt: ClientParams = {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
    }

    redisCache.init(redisOpt)
    googleAuth.initAsync({
        apiKey: config.googleConfis.clientSecret,
        clientId: config.googleConfis.clientId,
        redirectURI: config.googleConfis.redirectURL,
    })
    /*
        Initializing relational Database Connection
        Sequelize used as ORM
        TODO: Docker
    */
    const rdbOpt: RDBOptions = {
        uri : config.rdb.getConnectionString(),
    }

    rdb.initAsync(rdbOpt)

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

export { logger, redisCache, rdb, facebook, googleAuth }
