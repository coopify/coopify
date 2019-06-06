import * as nock from 'nock'
import { blockchain } from '../../config'
import { logger } from '../../src/server/services'
import moment = require('moment')

export function mockGetBalanceOkRequest(userId) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .get(`/api/users/${userId}/balance`)
        .reply(200, { balance: 200 })
    logger.info(`Mocking successful balance request for user ${userId} `)
}

export function mockGetBalanceErrorRequest(userId) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .get(`/api/users/${userId}/balance`)
        .reply(500, {  })
    logger.info(`Mocking failure balance request for user ${userId} `)
}

export function mockSignUpOkRequest() {
    nock(`${blockchain.route}:${blockchain.port}`)
        .post(`/api/users/signup`)
        .reply(200, {})
    logger.info(`Mocking successful signup request`)
}

export function mockSignUpErrorRequest() {
    nock(`${blockchain.route}:${blockchain.port}`)
        .post(`/api/users/signup`)
        .reply(500, {})
    logger.info(`Mocking failure signup request`)
}

export function mockPayRewardOkRequest(userId) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .post(`/api/users/reward`)
        .reply(200, {})
    logger.info(`Mocking successful balance request for user ${userId} `)
}

export function mockPayRewardErrorRequest(userId) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .post(`/api/users/reward`)
        .reply(500, {})
    logger.info(`Mocking failure balance request for user ${userId} `)
}

export function mockGetTransactionsOkRequest(userId: string, toId: string, fromId: string) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .get(`/api/users/${userId}/transactions`)
        .reply(200, [{
            date: moment(Date.now()).toDate(),
            coopies: 40,
            from: fromId,
            to: toId,
            inOut: 'in',
            description: 'Description',
            proposalId: 'proposalId',
        }])
    logger.info(`Mocking successful transcations request for user ${userId} `)
}

export function mockGetTransactionsErrorRequest(userId: string) {
    nock(`${blockchain.route}:${blockchain.port}`)
        .get(`/api/users/${userId}/transactions`)
        .reply(500, {  })
    logger.info(`Mocking failure transcations request for user ${userId} `)
}
