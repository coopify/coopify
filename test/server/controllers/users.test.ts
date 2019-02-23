import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { UserAttributes, UserUpateAttributes, User } from '../../../src/server/models'
import { app } from '../../../src/server'
import { factory } from '../factory'
import { logger } from '../../../src/server/services';
import * as moment from 'moment'

const request = supertest(app)
const createUser: UserAttributes = {
    email : 'sdfs@test.com',
    password: 'cdelsur',
    pictureURL : 'http://codigo.com',
}
const updateUser: UserUpateAttributes = {
    name: 'Default',
    address: 'default 1123',
    bio: `Some bio`,
    birthdate: moment(Date.now()).subtract(19, 'years').toDate(),
    gender: 'Female',
    lastName: 'Default 2',
    phone: 'Default phone',
    interests: new Array<{ name: string, selected: boolean }>(),
    pictureURL: 'Some URL'
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
    describe('#PUT /api/users/:userId', async () => {
        context('Users already registered', async () => {
            let user: User, token: string
            beforeEach(async () =>  {
                user = await factory.create('user', createUser)
                token = (await logInUser(user)).accessToken
            })
            it('Should not create a new user due to a taken email', async () => {
                const res = await request.put(`/api/users/${user.id}`).set('Authorization', `bearer ${token}`).send({ attributes: updateUser }).expect(200)
                expect(res.body.user).to.exist('Did not respond user')
                expect(res.body.user.name).to.eq(updateUser.name)
                expect(res.body.user.address).to.eq(updateUser.address)
                expect(res.body.user.bio).to.eq(updateUser.bio)
                expect(res.body.user.gender).to.eq(updateUser.gender)
                expect(res.body.user.lastName).to.eq(updateUser.lastName)
                expect(res.body.user.phone).to.eq(updateUser.phone)
                expect(res.body.user.pictureURL).to.eq(updateUser.pictureURL)
                expect(res.body.user.interests.length).to.eq(updateUser.interests ? updateUser.interests.length : 0)
            })
            it('Should not create a new user due to a taken email', async () => {
                const res = await request.put(`/api/users/${user.id}`).set('Authorization', `bearer ${token}`).expect(403)
                expect(res.body.message).to.eq('Missing required data')
            })
            it('Should not create a new user due to a taken email', async () => {
                const clone = _.cloneDeep(createUser)
                clone.email = 'other@email.com'
                const otherUser = await factory.create('user', clone)
                const otherToken = (await logInUser(otherUser)).accessToken
                const res = await request.put(`/api/users/${user.id}`).set('Authorization', `bearer ${otherToken}`).send({ attributes: updateUser }).expect(403)
                expect(res.body.message).to.eq(`Unauthorised. You don't have ownership of the selected resource`)
            })
            it('Should not create a new user due to a taken email', async () => {
                const res = await request.put(`/api/users/${user.id}`).send({ attributes: updateUser }).expect(403)
                expect(res.body.message).to.eq(`Unauthorised. You need to provide a valid bearer token`)
            })
            it('Should not create a new user due to a taken email', async () => {
                const res = await request.put(`/api/users/${user.id}`).set('Authorization', `bearer ${token}`).send({ attributes: { gender: 'Fruta' } }).expect(400)
                expect(res.body.message).to.eq(`Invalid gender`)
            })
            it('Should not create a new user due to a taken email', async () => {
                const res = await request.put(`/api/users/${user.id}`).set('Authorization', `bearer ${token}`).send({ attributes: { birthdate: new Date(Date.now()) } }).expect(400)
                expect(res.body.message).to.eq(`You must be over 18 years old`)
            })
        })
    })
})
