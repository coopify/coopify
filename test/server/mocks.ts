import * as nock from 'nock'
import { blockchain } from '../../config'
import { logger } from '../../src/server/services';

export function mockURL(userId) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .get(`/api/users/${userId}/balance`)
        .reply(200, { balance: 200 })
    logger.info(`Mocking balance URL for user ${userId} `)
}

export function mockURLWithErrorResponse(userId) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .get(`/api/users/${userId}/balance`)
        .reply(500, {  })
    logger.info(`Mocking balance URL for user ${userId} `)
}
