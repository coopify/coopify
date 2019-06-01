import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createQuestion, createOffer, createUser, createUser2 } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Messages Tests', async () => {
    describe('#GET /api/messages/:conversationId', async () => { })

    describe('#POST /api/messages/:conversationId', async () => { })
})
