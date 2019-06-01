import * as dotenv from 'dotenv'
dotenv.config({ path: './test/conf' })

import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'
import * as chaiChange from 'chai-change'
import * as config from '../config'
import { initExternalServices, initWLogger, rdb, logger } from '../src/server/services'

chai.use(dirtyChai)
chai.use(chaiChange)

config.validateAll()

before(async () => {
    initWLogger()
    await initExternalServices()
    logger.info('TESTS => Services initialized')
})

beforeEach('cleanDatabase', async () => {
    //this.timeout(5000)
    await rdb.sequelize.truncate({ cascade: true })
})
