import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import * as uuid from 'uuid'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createQuestion, createOffer, createUser, createRate, createProposal, createConversation } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Rate Tests', async () => {
    describe('#GET /api/rate/', async () => {
        context('Rates already created', async () => {
            let reviewer, offer1, offer2
            beforeEach(async () =>  {
                const createReviewerClone = _.cloneDeep(createUser)
                createReviewerClone.email = 'reviewer@email.com'
                reviewer = await factory.create('user', createReviewerClone)
                const createReviewedClone = _.cloneDeep(createUser)
                createReviewedClone.email = 'reviewed@email.com'
                const reviewed = await factory.create('user', createReviewedClone)
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = reviewed.id
                offer1 = await factory.create('offer', createOfferClone)
                createOfferClone.userId = reviewer.id
                offer2 = await factory.create('offer', createOfferClone)
                const createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = reviewer.id
                createConversationClone.toId = reviewed.id
                const conversation = await factory.create('conversation', createConversationClone)
                for (let index = 0; index < 15; index++) {
                    if (index < 7) {
                        const createProposalClone = _.cloneDeep(createProposal)
                        createProposalClone.conversationId = conversation.id
                        createProposalClone.offerId = offer1.id
                        createProposalClone.proposerId = reviewer.id
                        const proposal = await factory.create('proposal', createProposalClone)
                        const createRateClone = _.cloneDeep(createRate)
                        createRateClone.offerId = offer1.id
                        createRateClone.proposalId = proposal.id
                        createRateClone.reviewedUserId = reviewed.id
                        createRateClone.reviewerUserId = reviewer.id
                        createRateClone.description = `Rate number ${index}`
                        await factory.create('rate', createRateClone)
                    } else {
                        const createProposalClone = _.cloneDeep(createProposal)
                        createProposalClone.conversationId = conversation.id
                        createProposalClone.offerId = offer2.id
                        createProposalClone.proposerId = reviewed.id
                        const proposal = await factory.create('proposal', createProposalClone)
                        const createRateClone = _.cloneDeep(createRate)
                        createRateClone.offerId = offer2.id
                        createRateClone.proposalId = proposal.id
                        createRateClone.reviewedUserId = reviewer.id
                        createRateClone.reviewerUserId = reviewed.id
                        createRateClone.description = `Rate number ${index}`
                        await factory.create('rate', createRateClone)
                    }
                }
            })
            it('Should get the rate list', async () => {
                const res = await request.get('/api/rates/').expect(200)
                expect(res.body.rates.length).to.eq(15)
                expect(res.body.rates[0].description).to.eq(`Rate number 14`)
            })
            it('Should get the rate list', async () => {
                const res = await request.get(`/api/rates/?reviewedUserId=${reviewer.id}`).expect(200)
                expect(res.body.rates.length).to.eq(8)
                expect(res.body.rates[0].description).to.eq(`Rate number 14`)
            })
            it('Should get the rate list', async () => {
                const res = await request.get(`/api/rates/?offerId=${offer1.id}`).expect(200)
                expect(res.body.rates.length).to.eq(7)
                expect(res.body.rates[0].description).to.eq(`Rate number 6`)
            })
        })
    })
    describe('#GET /api/rate/', async () => {
        context('Rates already created', async () => {
            let reviewer, offer, conversation, token
            beforeEach(async () =>  {
                const createReviewerClone = _.cloneDeep(createUser)
                createReviewerClone.email = 'reviewer@email.com'
                reviewer = await factory.create('user', createReviewerClone)
                token = (await logInUser(reviewer)).accessToken
                const createReviewedClone = _.cloneDeep(createUser)
                createReviewedClone.email = 'reviewed@email.com'
                const reviewed = await factory.create('user', createReviewedClone)
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = reviewed.id
                offer = await factory.create('offer', createOfferClone)
                const createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = reviewer.id
                createConversationClone.toId = reviewed.id
                conversation = await factory.create('conversation', createConversationClone)
            })
            it('Should get the rate list', async () => {
                const createProposalClone = _.cloneDeep(createProposal)
                createProposalClone.conversationId = conversation.id
                createProposalClone.offerId = offer.id
                createProposalClone.proposerId = reviewer.id
                createProposalClone.status = 'Confirmed'
                await factory.create('proposal', createProposalClone)
                const res = await request.get(`/api/rates/${offer.id}/reviewable`).set('Authorization', `bearer ${token}`).expect(200)
                expect(res.body.shouldReview).to.eq(true)
            })
            it('Should get the rate list', async () => {
                const createProposalClone = _.cloneDeep(createProposal)
                createProposalClone.conversationId = conversation.id
                createProposalClone.offerId = offer.id
                createProposalClone.proposerId = reviewer.id
                createProposalClone.status = 'Rejected'
                await factory.create('proposal', createProposalClone)
                const res = await request.get(`/api/rates/${offer.id}/reviewable`).set('Authorization', `bearer ${token}`).expect(200)
                expect(res.body.shouldReview).to.eq(false)
            })
            it('Should get the rate list', async () => {
                const createUserClone = _.cloneDeep(createUser)
                createUserClone.email = 'other@user.com'
                const otherUser = await factory.create('user', createUserClone)
                const createProposalClone = _.cloneDeep(createProposal)
                createProposalClone.conversationId = conversation.id
                createProposalClone.offerId = offer.id
                createProposalClone.proposerId = otherUser.id
                createProposalClone.status = 'Confirmed'
                await factory.create('proposal', createProposalClone)
                const res = await request.get(`/api/rates/${offer.id}/reviewable`).set('Authorization', `bearer ${token}`).expect(200)
                expect(res.body.shouldReview).to.eq(false)
            })
        })
    })
    describe('#POST /api/rate/', async () => {
        context('Rates already created', async () => {
            let reviewer, offer, conversation, token
            beforeEach(async () =>  {
                const createReviewerClone = _.cloneDeep(createUser)
                createReviewerClone.email = 'reviewer@email.com'
                reviewer = await factory.create('user', createReviewerClone)
                token = (await logInUser(reviewer)).accessToken
                const createReviewedClone = _.cloneDeep(createUser)
                createReviewedClone.email = 'reviewed@email.com'
                const reviewed = await factory.create('user', createReviewedClone)
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = reviewed.id
                offer = await factory.create('offer', createOfferClone)
                const createConversationClone = _.cloneDeep(createConversation)
                createConversationClone.fromId = reviewer.id
                createConversationClone.toId = reviewed.id
                conversation = await factory.create('conversation', createConversationClone)
            })
            it('Should get the rate list', async () => {
                const createProposalClone = _.cloneDeep(createProposal)
                createProposalClone.conversationId = conversation.id
                createProposalClone.offerId = offer.id
                createProposalClone.proposerId = reviewer.id
                createProposalClone.status = 'Confirmed'
                await factory.create('proposal', createProposalClone)
                const res = await request.post(`/api/rates/${offer.id}`).send({ description: 'desc', rate: 2 }).set('Authorization', `bearer ${token}`).expect(200)
                expect(res.body.rate).to.exist('Failed to create rate')
                expect(res.body.rate.reviewer).to.exist('Failed to create rate')
                expect(res.body.rate.reviewer.id).to.eq(reviewer.id)
                expect(res.body.rate.rate).to.eq(2)
            })
            it('Should get the rate list', async () => {
                const createProposalClone = _.cloneDeep(createProposal)
                createProposalClone.conversationId = conversation.id
                createProposalClone.offerId = offer.id
                createProposalClone.proposerId = reviewer.id
                createProposalClone.status = 'Rejected'
                await factory.create('proposal', createProposalClone)
                const res = await request.post(`/api/rates/${offer.id}`).send({ description: 'desc', rate: 2 }).set('Authorization', `bearer ${token}`).expect(400)
                expect(res.body.message).to.eq('You need an accepted proposal to make a review')
            })
            it('Should get the rate list', async () => {
                const createProposalClone = _.cloneDeep(createProposal)
                createProposalClone.conversationId = conversation.id
                createProposalClone.offerId = offer.id
                createProposalClone.proposerId = reviewer.id
                createProposalClone.status = 'Rejected'
                await factory.create('proposal', createProposalClone)
                const res = await request.post(`/api/rates/${offer.id}`).send({ rate: 2 }).set('Authorization', `bearer ${token}`).expect(400)
                expect(res.body.message).to.eq('Missing required data')
            })
        })
    })
})
