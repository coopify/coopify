import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createUser, createOffer, createCategory } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Offer Tests', async () => {
    describe('#GET /api/offers/', async () => {
        context('Offer already created', async () => {
            let createOfferClone, user
            beforeEach(async () => {
                user = await factory.create('user', createUser)
            })
            it('Should get the offer list with one element', async () => {
                createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                await factory.create('offer', createOfferClone)
                const res = await request.get('/api/offers/').expect(200)
                expect(res.body.offers.length).to.eq(1)
                expect(res.body.offers[0].userId).to.eq(createOfferClone.userId)
                expect(res.body.offers[0].status).to.eq(createOfferClone.status)
                expect(res.body.offers[0].paymentMethod).to.eq(createOfferClone.paymentMethod)
            })
            it('Should get an empty offer list', async () => {
                const res = await request.get('/api/offers/').expect(200)
                expect(res.body.offers.length).to.eq(0)
            })
        })
        context('Pagination tests', async () => {
            let user
            beforeEach(async () =>  {
                user = await factory.create('user', createUser)
                for (let index = 0; index < 15; index++) {
                    const createOfferClone = _.cloneDeep(createOffer)
                    createOfferClone.title = 'Test offer ' + index + 1
                    createOfferClone.userId = user.id
                    await factory.create('offer', createOfferClone)
                }
            })
            it('Should get the offer list with one element', async () => {
                const res = await request.get('/api/offers/?limit=5&skip=0').expect(200)
                expect(res.body.offers.length).to.eq(5)
                expect(res.body.count).to.eq(15)
            })
            it('Should get the offer list with one element', async () => {
                const res = await request.get('/api/offers/?limit=5&skip=2').expect(200)
                expect(res.body.offers.length).to.eq(5)
                expect(res.body.count).to.eq(15)
            })
            it('Should get the offer list with one element', async () => {
                const res = await request.get('/api/offers/?limit=5&skip=4').expect(200)
                expect(res.body.offers.length).to.eq(0)
                expect(res.body.count).to.eq(15)
            })
            it('Should get the offer list with one element', async () => {
                const res = await request.get('/api/offers/?limit=8&skip=1').expect(200)
                expect(res.body.offers.length).to.eq(7)
                expect(res.body.count).to.eq(15)
            })
            it('Should get an empty offer list', async () => {
                const res = await request.get('/api/offers/').expect(200)
                expect(res.body.offers.length).to.eq(15)
            })
        })
    })

    describe('#GET /api/offers/:offerId', async () => {
        context('Offer already created', async () => {
            let createOfferClone, offerId
            beforeEach(async () => {
                const user = await factory.create('user', createUser)
                createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                const offer = await factory.create('offer', createOfferClone)
                offerId = offer.id
            })
            it('Should get the offer list', async () => {
                const res = await request.get(`/api/offers/${offerId}`).expect(200)
                expect(res.body.offer.id).to.eq(offerId)
                expect(res.body.offer.userId).to.eq(createOfferClone.userId)
                expect(res.body.offer.status).to.eq(createOfferClone.status)
                expect(res.body.offer.paymentMethod).to.eq(createOfferClone.paymentMethod)
            })
        })
    })

    describe('#POST /api/offers/', async () => {
        context('No offer created', async () => {
            let createOfferClone, user
            beforeEach(async () =>  {
                user = await factory.create('user', createUser)
                createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                createCategoryClone = _.cloneDeep(createCategory)
                const cat = await factory.create('category', createCategoryClone)
                categoryId = cat.id
            })
            it('Should create the new offer', async () => {
                const token = (await logInUser(user)).accessToken
                const res = await request.post('/api/offers/').set('Authorization', `bearer ${token}`)
                    .send(createOfferClone).expect(200)
                expect(res.body.offer.userId).to.eq(createOfferClone.userId)
                expect(res.body.offer.status).to.eq(createOfferClone.status)
            })
            it('Should create the new offer with its prices', async () => {
                const token = (await logInUser(user)).accessToken
                createOfferClone.prices = new Array()
                createOfferClone.prices.push({ selected: true, frequency: 'FinalProduct', price: 20 })
                const res = await request.post('/api/offers/').set('Authorization', `bearer ${token}`)
                    .send(createOfferClone).expect(200)
                expect(res.body.offer.userId).to.eq(createOfferClone.userId)
                expect(res.body.offer.status).to.eq(createOfferClone.status)
            })
            it.only('Should create the new offer with a category asociated', async () => {
                const token = (await logInUser(user)).accessToken
                createOfferClone.prices = new Array()
                createOfferClone.prices.push({ selected: true, frequency: 'FinalProduct', price: 20 })
                createOfferClone.categories = new Array()
                createOfferClone.categories.push(categoryId)
                const res = await request.post('/api/offers/').set('Authorization', `bearer ${token}`)
                    .send(createOfferClone).expect(200)
                expect(res.body.offer.userId).to.eq(createOfferClone.userId)
                expect(res.body.offer.categories[0].id).to.eq(categoryId)
                expect(res.body.offer.status).to.eq(createOfferClone.status)
                expect(res.body.offer.categories[0].id).to.eq(createOfferClone.categories[0])
            })
        })
    })
})
