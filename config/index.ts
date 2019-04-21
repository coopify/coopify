import { GoogleConfigs } from './googleAuthentication'
import { LoggerConfigs } from './wLogger'
import { ServerConfigs } from './server'
import { RDBConfigs } from './rdb'
import { RedisConfigs } from './redis'
import { FacebookConfigs } from './facebook'
import { SendgridConfigs } from './sendgrid'
import { BlockchainConfigs } from './blockchain'
import { PusherConfigs } from './pusher'

const wLogger = new LoggerConfigs()
const server = new ServerConfigs()
const redis = new RedisConfigs()
const rdb = new RDBConfigs()
const facebook = new FacebookConfigs()
const googleConfis = new GoogleConfigs()
const sendgrid = new SendgridConfigs()
const blockchain = new BlockchainConfigs()
const pusher = new PusherConfigs()

export function validateAll() {
    return [
        wLogger.validate(),
        server.validate(),
        rdb.validate(),
        redis.validate(),
        facebook.validate(),
        googleConfis.validate(),
        sendgrid.validate(),
        blockchain.validate(),
        pusher.validate(),
      ].filter((x) => x.hasErrors)
}

export { wLogger, server, redis, rdb, facebook, googleConfis, sendgrid, blockchain, pusher }
