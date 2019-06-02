import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createUser, createUser2, createConversation } from '../factory'
import { logger } from '../../../src/server/services'
import * as uuid from 'uuid'

const request = supertest(app)

describe('Conversation Tests', async () => {
    describe('#GET /api/conversations/', async () => {
        context('Conversation already created', async () => {
            let createConversationClone, user, user2
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                user2 = await factory.create('user', createUser2)
            })
            it('Should get the conversation list with one element', async () => {
                const token = (await logInUser(user)).accessToken
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
                createConversationClone.toId = user2.id
                await factory.create('conversation', createConversationClone)
                const res = await request.get('/api/conversations/').set('Authorization', `bearer ${token}`)
                    .send(createConversationClone).expect(200)
                expect(res.body.conversations.length).to.eq(1)
                expect(res.body.conversations[0].from.id).to.eq(createConversationClone.fromId)
                expect(res.body.conversations[0].to.id).to.eq(createConversationClone.toId)
            })
            it('Should get an empty conversation list', async () => {
                const token = (await logInUser(user)).accessToken
                const res = await request.get('/api/conversations/').set('Authorization', `bearer ${token}`)
                    .send(createConversationClone).expect(200)
                expect(res.body.conversations.length).to.eq(0)
            })
            it('Should not be allow to access to the conversation', async () => {
                const res = await request.get('/api/conversations/').expect(401)
                expect(res.body.message).to.eq('Unauthorized you need to provide a valid token')
            })
        })
    })

    describe('#GET /api/conversations/:conversationId', async () => {
        context('Conversation already created', async () => {
            let createConversationClone, conversationId, user, user2
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                user2 = await factory.create('user', createUser2)
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
                createConversationClone.toId = user2.id
                const conversation = await factory.create('conversation', createConversationClone)
                conversationId = conversation.id
            })
            it('Should get the conversation', async () => {
                const token = (await logInUser(user)).accessToken
                const res = await request.get(`/api/conversations/${conversationId}`).expect(200)
                expect(res.body.conversation.id).to.eq(conversationId)
                expect(res.body.conversation.from.id).to.eq(createConversationClone.fromId)
                expect(res.body.conversation.to.id).to.eq(createConversationClone.toId)
            })
        })
        context('No conversation previously created', async () => {
            let user
            beforeEach(async () => {
                user = await factory.create('user', createUser)
            })
            it('Should not get the conversation', async () => {
                const conversationId: string = uuid()
                const token = (await logInUser(user)).accessToken
                const res = await request.get(`/api/conversations/${conversationId}`).expect(404)
                expect(res.body.message).to.eq('Conversation not found')
            })
        })
    })

    describe('#POST /api/conversations/', async () => {
        context('No conversation created', async () => {
            let user, user2, createConversationClone
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                user2 = await factory.create('user', createUser2)
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
            })
            it('Should create the new conversation', async () => {
                createConversationClone.toId = user2.id
                const token = (await logInUser(user)).accessToken
                const res = await request.post('/api/conversations/').set('Authorization', `bearer ${token}`)
                    .send(createConversationClone).expect(200)
                expect(res.body.conversation.from).to.eq(createConversationClone.fromId)
                expect(res.body.conversation.to).to.eq(createConversationClone.toId)
            })
            it('Should not create the new conversation', async () => {
                createConversationClone.toId = user.id
                const token = (await logInUser(user)).accessToken
                const res = await request.post('/api/conversations/').set('Authorization', `bearer ${token}`)
                    .send(createConversationClone).expect(400)
                expect(res.body.message).to.eq('You cant start a conversation with your self')
            })
            it('Should create the new conversation despite there being one between the involved users', async () => {
                createConversationClone.toId = user2.id
                const token = (await logInUser(user)).accessToken
                await request.post('/api/conversations/').set('Authorization', `bearer ${token}`)
                    .send(createConversationClone)
                const res = await request.post('/api/conversations/').set('Authorization', `bearer ${token}`)
                    .send(createConversationClone).expect(200)
                logger.info(`RES => ${JSON.stringify(res.body)}`)
                expect(res.body.conversation.from.id).to.eq(user.id)
                expect(res.body.conversation.to.id).to.eq(user2.id)
            })
        })
    })
})
