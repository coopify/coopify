import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createUser, createOffer, createCategory, createQuestion } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Conversation Tests', async () => {
    describe('#GET /api/converstions/', async () => { })

    describe('#GET /api/conversations/:conversationId', async () => { })

    describe('#POST /api/conversations/', async () => { })
})
