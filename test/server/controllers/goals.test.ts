import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import * as supertest from 'supertest'
import * as _ from 'lodash'
import { logInUser } from './helpers'
import { app } from '../../../src/server'
import { factory, createGoal, createUser, createUserGoal } from '../factory'

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
        context('Goals pagination tests', async () => {
            beforeEach(async () =>  {
                for (let index = 0; index < 15; index++) {
                    const createGoalClone = _.cloneDeep(createGoal)
                    createGoalClone.name = 'Test goal ' + index + 1
                    createGoalClone.description = 'Description' + index + 1
                    await factory.create('goal', createGoalClone)
                }
            })
            it('Should get the goal list with five elements', async () => {
                const res = await request.get('/api/goals/?limit=5&skip=0').expect(200)
                expect(res.body.goals.length).to.eq(5)
                expect(res.body.count).to.eq(15)
            })
            it('Should get the goal list with five elements', async () => {
                const res = await request.get('/api/goals/?limit=5&skip=2').expect(200)
                expect(res.body.goals.length).to.eq(5)
                expect(res.body.count).to.eq(15)
            })
            it('Should get an empty goal list', async () => {
                const res = await request.get('/api/goals/?limit=5&skip=4').expect(200)
                expect(res.body.goals.length).to.eq(0)
                expect(res.body.count).to.eq(15)
            })
            it('Should get the goal list with seven elements', async () => {
                const res = await request.get('/api/goals/?limit=8&skip=1').expect(200)
                expect(res.body.goals.length).to.eq(7)
                expect(res.body.count).to.eq(15)
            })
            it('Should get a complete goal list', async () => {
                const res = await request.get('/api/goals/').expect(200)
                expect(res.body.goals.length).to.eq(15)
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
    describe('#GET /api/goals/user/:userId', async () => {
        context('User and Goal already created', async () => {
            let createUserGoalClone, user, token, goal, userGoal
            beforeEach(async () => {
                user = await factory.create('user', createUser)
                token = (await logInUser(user)).accessToken
            })
            it('Should get the goal list with one element', async () => {
                const createGoalClone = _.cloneDeep(createGoal)
                goal = await factory.create('goal', createGoalClone)

                createUserGoalClone = _.cloneDeep(createUserGoal)
                createUserGoalClone.userId = user.id
                createUserGoalClone.goalId = goal.id
                userGoal = await factory.create('usergoal', createUserGoalClone)

                const res = await request.get(`/api/goals/user/${user.id}`).set('Authorization', `bearer ${token}`).expect(200)
                expect(res.body.length).to.eq(1)
                expect(res.body[0].goalId).to.eq(goal.id)
                expect(res.body[0].userId).to.eq(user.id)
            })
            it('Should get an empty user goal list', async () => {
                const res = await request.get(`/api/goals/user/${user.id}`).set('Authorization', `bearer ${token}`).expect(200)
                expect(res.body.length).to.eq(0)
            })
        })
    })
})
