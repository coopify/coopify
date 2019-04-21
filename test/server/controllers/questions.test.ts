import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createQuestion, createOffer, createUser, createUser2 } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Questions Tests', async () => {
    describe('#GET /api/questions/', async () => {
        context('Question already created', async () => {
            let createQuestionClone, user, offer
            it('Should get the question list with one element', async () => {
                user = await factory.create('user', createUser)
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                offer = await factory.create('offer', createOfferClone)
                createQuestionClone = _.cloneDeep(createQuestion)
                createQuestionClone.authorId = user.id
                createQuestionClone.offerId = offer.id
                await factory.create('question', createQuestionClone)
                const res = await request.get('/api/questions/').expect(200)
                expect(res.body.questions.length).to.eq(1)
                expect(res.body.questions[0].name).to.eq(createQuestionClone.name)
            })
            it('Should get an empty question list', async () => {
                const res = await request.get('/api/questions/').expect(200)
                expect(res.body.questions.length).to.eq(0)
            })
        })
    })

    describe('#GET /api/questions/:questionId', async () => {
        context('Question already created', async () => {
            let createQuestionClone, questionId, user, offer
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                offer = await factory.create('offer', createOfferClone)
            })
            it('Should get the question list with the required parameters', async () => {
                createQuestionClone = _.cloneDeep(createQuestion)
                createQuestionClone.authorId = user.id
                createQuestionClone.offerId = offer.id
                const question = await factory.create('question', createQuestionClone)
                questionId = question.id
                const res = await request.get(`/api/questions/${questionId}`).expect(200)
                expect(res.body.question.id).to.eq(questionId)
                expect(res.body.question.name).to.eq(createQuestionClone.name)
            })
        })
    })

    describe('#PUT /api/questions/:questionId', async () => {
        context('Question already created', async () => {
            let user, token: string, offer, createQuestionClone, questionId
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                token = (await logInUser(user)).accessToken
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                offer = await factory.create('offer', createOfferClone)
                createQuestionClone = _.cloneDeep(createQuestion)
                createQuestionClone.authorId = user.id
                createQuestionClone.offerId = offer.id
                const question = await factory.create('question', createQuestionClone)
                questionId = question.id
            })
            it('Should not update the question due to an empty response', async () => {
                const res = await request.put(`/api/questions/${questionId}`).set('Authorization', `bearer ${token}`)
                    .send({ attributes: { response: '' } }).expect(403)
                expect(res.body.message).to.eq('Missing required data')
            })
            it('Should not update the question due to not be the offer ownership', async () => {
                const user2 = await factory.create('user', createUser2)
                const token2 = (await logInUser(user2)).accessToken
                const res = await request.put(`/api/questions/${questionId}`).set('Authorization', `bearer ${token2}`)
                    .send({ attributes: { response: 'Some response' } }).expect(403)
                expect(res.body.message).to.eq('User does not own this offer')
            })
            it('Should update the question', async () => {
                const res = await request.put(`/api/questions/${questionId}`).set('Authorization', `bearer ${token}`)
                    .send({ attributes: { response: 'Some response' } }).expect(200)
                expect(res.body.question.id).to.eq(questionId)
                expect(res.body.question.authorId).to.eq(user.id)
                expect(res.body.question.offerId).to.eq(offer.id)
            })
        })
    })

    describe('#POST /api/questions/:offerId', async () => {
        context('No question created', async () => {
            let createQuestionClone, offer, token
            beforeEach(async () => {
                const user = await factory.create('user', createUser)
                token = (await logInUser(user)).accessToken
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                offer = await factory.create('offer', createOfferClone)
                createQuestionClone = _.cloneDeep(createQuestion)
                createQuestionClone.authorId = user.id
                createQuestionClone.offerId = offer.id
            })
            it('Should create the new question', async () => {
                const res = await request.post(`/api/questions/${offer.id}`).set('Authorization', `bearer ${token}`)
                    .send(createQuestionClone).expect(200)
                expect(res.body.question.authorId).to.eq(createQuestionClone.authorId)
                expect(res.body.question.offerId).to.eq(createQuestionClone.offerId)
            })
        })
    })
})
