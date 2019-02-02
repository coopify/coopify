import { LoggerConfigs } from './wLogger'
import { ApnConfigs } from './apn'
import { ServerConfigs } from './server'
import { RDBConfigs } from './rdb'
import { RedisConfigs } from './redis'
import { MongoConfigs } from './mongodb'

const wLogger = new LoggerConfigs()
const apn = new ApnConfigs()
const server = new ServerConfigs()
const redis = new RedisConfigs()
const rdb = new RDBConfigs()
const mongodb = new MongoConfigs()

export function validateAll() {
    return [
        // apn.validate(),
        wLogger.validate(),
        server.validate(),
        rdb.validate(),
        redis.validate(),
        // mongodb.validate(),
      ].filter((x) => x.hasErrors)
}

export { wLogger, apn, server, redis, rdb, mongodb }
