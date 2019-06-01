import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createGoal, createUser, createUserGoal } from '../factory'
import { logger } from '../../../src/server/services'

const request = supertest(app)

describe('Goal Tests', async () => {
    describe('#GET /api/goals/', async () => {
        context('Goal already created', async () => {
            let createGoalClone
            it('Should get the goal list with one element', async () => {
                createGoalClone = _.cloneDeep(createGoal)
                await factory.create('goal', createGoalClone)
                const res = await request.get('/api/goals/').expect(200)
                expect(res.body.goals.length).to.eq(1)
                expect(res.body.goals[0].name).to.eq(createGoalClone.name)
            })
            it('Should get an empty goal list', async () => {
                const res = await request.get('/api/goals/').expect(200)
                expect(res.body.goals.length).to.eq(0)
            })
        })
    })

    describe('#GET /api/goals/:goalId', async () => {
        context('Goal already created', async () => {
            let createGoalClone, goalId
            beforeEach(async () => {
                createGoalClone = _.cloneDeep(createGoal)
                const goal = await factory.create('goal', createGoalClone)
                goalId = goal.id
            })
            it('Should get the goal list with the required parameters', async () => {
                const res = await request.get(`/api/goals/${goalId}`).expect(200)
                expect(res.body.goal.id).to.eq(goalId)
                expect(res.body.goal.name).to.eq(createGoalClone.name)
            })
        })
    })
})

describe('User Goal Tests', async () => {
    describe('#GET /api/goals/', async () => {
        context('Goal already created', async () => {
            let createGoalClone, createUserGoalClone, user, token, goal, userGoal
            it.only('Should get the goal list with one element', async () => {
                createGoalClone = _.cloneDeep(createGoal)
                goal = await factory.create('goal', createGoalClone)

                user = await factory.create('user', createUser)
                token = (await logInUser(user)).accessToken
                logger.info(`USER IN TEST => ${JSON.stringify(user)}`)

                createUserGoalClone = _.cloneDeep(createUserGoal)
                createUserGoalClone.userId = user.id
                createUserGoalClone.goalId = goal.id
                userGoal = await factory.create('userGoal', createUserGoalClone)

                logger.info(`USERGOAL IN TEST => ${JSON.stringify(userGoal)}`)

                const res = await request.get(`/api/goals/user/${user.id}`).set('Authorization', `bearer ${token}`)
                .expect(200)
                logger.info(`RESPONSE => ${JSON.stringify(res)}`)
                /*expect(res.body.user.goals.length).to.eq(1)
                expect(res.body.user.goals[0].name).to.eq(createGoalClone.name)*/
            })
            it('Should get an empty goal list', async () => {
                const res = await request.get('/api/goals/').expect(200)
                expect(res.body.goals.length).to.eq(0)
            })
        })
    })
})
