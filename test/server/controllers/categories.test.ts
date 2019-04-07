import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createCategory } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Category Tests', async () => {
    describe('#GET /api/categories/', async () => {
        context('Category already created', async () => {
            let createCategoryClone
            it('Should get the offer list with one element', async () => {
                createCategoryClone = _.cloneDeep(createCategory)
                await factory.create('category', createCategoryClone)
                const res = await request.get('/api/categories/').expect(200)
                expect(res.body.categories.length).to.eq(1)
                expect(res.body.categories[0].name).to.eq(createCategoryClone.name)
            })
            it('Should get an empty category list', async () => {
                const res = await request.get('/api/categories/').expect(200)
                expect(res.body.categories.length).to.eq(0)
            })
        })
    })

    describe('#GET /api/categories/:categoryId', async () => {
        context('Category already created', async () => {
            let createCategoryClone, categoryId
            beforeEach(async () => {
                createCategoryClone = _.cloneDeep(createCategory)
                const cat = await factory.create('category', createCategoryClone)
                categoryId = cat.id
            })
            it('Should get the category list with the required parameters', async () => {
                const res = await request.get(`/api/categories/${categoryId}`).expect(200)
                expect(res.body.category.id).to.eq(categoryId)
                expect(res.body.category.name).to.eq(createCategoryClone.name)
            })
        })
    })
})
