import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createUser, createUser2, createConversation, createMessage } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Messages Tests', async () => {
    describe('#GET /api/messages/:conversationId', async () => {
        context('Conversation already created', async () => {
            let createConversationClone, user, user2, createMessageClone
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                user2 = await factory.create('user', createUser2)
            })
            it('Should get the message list with one element', async () => {
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
                createConversationClone.toId = user2.id
                const conversation = await factory.create('conversation', createConversationClone)
                createMessageClone = _.cloneDeep(createMessage)
                createMessageClone.authorId = user.id
                createMessageClone.conversationId = conversation.id
                const message = await factory.create('message', createMessageClone)
                const res = await request.get(`/api/messages/${conversation.id}`).expect(200)
                expect(res.body.messages.length).to.eq(1)
                expect(res.body.messages[0].id).to.eq(message.id)
                expect(res.body.messages[0].authorId).to.eq(user.id)
                expect(res.body.messages[0].conversationId).to.eq(conversation.id)
                expect(res.body.messages[0].text).to.eq(message.text)
            })
            it('Should get an empty message from conversation', async () => {
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
                createConversationClone.toId = user2.id
                const conversation = await factory.create('conversation', createConversationClone)
                const res = await request.get(`/api/messages/${conversation.id}`).expect(200)
                expect(res.body.messages.length).to.eq(0)
            })
        })
    })

    describe('#POST /api/messages/:conversationId', async () => {
        context('Conversation already created', async () => {
            let createConversationClone, user, user2, createMessageClone
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                user2 = await factory.create('user', createUser2)
            })
            it.only('Should send the message to the conversation', async () => {
                const token = (await logInUser(user)).accessToken
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
                createConversationClone.toId = user2.id
                const conversation = await factory.create('conversation', createConversationClone)
                createMessageClone = _.cloneDeep(createMessage)
                createMessageClone.authorId = user.id
                createMessageClone.conversationId = conversation.id
                const res = await request.post(`/api/messages/${conversation.id}`).set('Authorization', `bearer ${token}`)
                    .send(createMessageClone).expect(200)
                expect(res.body.message.conversationId).to.eq(conversation.id)
                expect(res.body.message.text).to.eq(createMessageClone.text)
            })
            it.only('Should send a two way message to the conversation', async () => {
                const token = (await logInUser(user)).accessToken
                const token2 = (await logInUser(user2)).accessToken
                createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = user.id
                createConversationClone.toId = user2.id
                const conversation = await factory.create('conversation', createConversationClone)
                createMessageClone = _.cloneDeep(createMessage)
                createMessageClone.authorId = user.id
                createMessageClone.conversationId = conversation.id
                await request.post(`/api/messages/${conversation.id}`).set('Authorization', `bearer ${token}`)
                    .send(createMessageClone)
                await request.post(`/api/messages/${conversation.id}`).set('Authorization', `bearer ${token2}`)
                    .send(createMessageClone)
                const res = await request.get(`/api/messages/${conversation.id}`).expect(200)
                expect(res.body.messages.length).to.eq(2)
                expect(res.body.messages[0].authorId).to.eq(user.id)
                expect(res.body.messages[1].authorId).to.eq(user2.id)
                expect(res.body.messages[0].conversationId).to.eq(conversation.id)
                expect(res.body.messages[1].conversationId).to.eq(conversation.id)
                expect(res.body.messages[0].text).to.eq(createMessageClone.text)
                expect(res.body.messages[1].text).to.eq(createMessageClone.text)
            })
        })
    })
})
