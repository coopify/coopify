import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { usersController } from '../../../src/server/controllers'
import { UserAttributes } from '../../../src/server/models'
import { app } from '../../../src/server'
import { factory } from '../factory'
import { logger } from '../../../src/server/services';

const request = supertest(app)
const createUser: UserAttributes = {
    email : 'sdfs@test.com',
    password: 'cdelsur',
    pictureURL : 'http://codigo.com',
}

describe('User Tests', async () => {
    describe('#POST /api/users/singup', async () => {
        context('Users already registered', async () => {
            beforeEach(async () =>  {
                await factory.create('user', createUser)
            })
            it('Should not create a new user due to a taken email', async () => {
                const res = await request.post('/api/users/signup').send(createUser).expect(400)
                expect(res.body.message).to.eq('Email already in use')
            })
            it('Should not create a new user if no email is provided', async () => {
                const createUserClone = _.cloneDeep(createUser)
                delete createUserClone.email
                const res = await request.post('/api/users/signup').send(createUserClone).expect(400)
                expect(res.body.message).to.eq('Missing required data')
            })
            it('Should not create a new user if the email has an invalid format', async () => {
                const createUserClone = _.cloneDeep(createUser)
                createUserClone.email = 'somethin_gmail.com'
                const res = await request.post('/api/users/signup').send(createUserClone).expect(400)
                expect(res.body.message).to.eq('Invalid email')
            })
        })
        it('Should not create a new user due to a taken email', async () => {
            const res = await request.post('/api/users/signup').send(createUser).expect(200)
            expect(res.body.user).to.exist('Email already in use')
            expect(res.body.user.email).to.eq(createUser.email)
        })
    })
})
