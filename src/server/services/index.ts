import { googleAuth } from './googleAuthentication'
import { Logger } from './wLogger'
import { redisCache, ClientParams } from './redisCache'
import { rdb, IOptions as RDBOptions } from './rdb'
import * as config from '../../../config'
import { FacebookService } from './facebook'
import { sendgrid } from './sendgrid'
import { Blockchain } from './blockchain'
import { PusherService } from './pusher'

let facebook: FacebookService
let logger: Logger
let blockchain: Blockchain
let pusher: PusherService

export async function initExternalServices() {

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
    await googleAuth.initAsync({
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
        seqOptions: {
            host: config.rdb.host,
            database: config.rdb.name,
            password: config.rdb.password,
            port: config.rdb.port,
            username: config.rdb.user,
        },
        uri : config.rdb.getConnectionString(),
    }

    await rdb.initAsync(rdbOpt)

    await sendgrid.initAsync(config.sendgrid.apikey)

    blockchain = new Blockchain(config.blockchain)

    pusher = new PusherService({
        appId: config.pusher.appId,
        cluster: config.pusher.cluster,
        useTLS: true,
        key: config.pusher.apikey,
        secret: config.pusher.secret,
    })
}

/*
    We use Winston for logging
    defined levels are: error and info
    TODO: expand levels
*/
export function initWLogger() {
    const logLevel = config.wLogger.isValid ? config.wLogger.level : 'info'
    logger = new Logger(logLevel)
}

export { logger, redisCache, rdb, facebook, googleAuth, sendgrid, blockchain, pusher }
