import { ReferReward } from '../../../src/server/rewards/referReward'
import { ShareReward } from '../../../src/server/rewards/shareReward'
import { SignupReward } from '../../../src/server/rewards/signupReward'
import { factory, createUser, createGoal, createUserGoal, createOffer } from '../factory'
import { UserGoal, Offer } from '../../../src/server/models'
import { expect } from 'chai'
import * as _ from 'lodash'
import * as uuid from 'uuid'
import { mockPayRewardOkRequest, mockPayRewardErrorRequest, mockSignUpOkRequest, mockSignUpErrorRequest } from '../mocks'

const refer = new ReferReward()
const share = new ShareReward()
const signup = new SignupReward()

describe('Reward engine ests', async () => {
    describe('Refer reward', async () => {
        context('The ethereum BE is reachable', async () => {
            let user, goal
            beforeEach(async () => {
                const createUserClone = _.cloneDeep(createUser)
                const createGoalClone = _.cloneDeep(createGoal)
                user = await factory.create('user', createUserClone)
                createGoalClone.amount = 40
                createGoalClone.code = 'referral'
                goal = await factory.create('goal', createGoalClone)
                mockPayRewardOkRequest(user.id)
            })
            it('OK case', async () => {
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referral', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
            })
            it('OK case with prexistent UserGoal', async () => {
                await factory.create('usergoal', { code: 'referral', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referral', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(3)
            })
            it('Fail case due to an invalid stimulus', async () => {
                await factory.create('usergoal', { code: 'referral', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referralll', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(2)
            })
        })
        context('The ethereum BE isn´t reachable', async () => {
            let user
            beforeEach(async () => {
                const createUserClone = _.cloneDeep(createUser)
                const createGoalClone = _.cloneDeep(createGoal)
                user = await factory.create('user', createUserClone)
                createGoalClone.amount = 40
                createGoalClone.code = 'referral'
                await factory.create('goal', createGoalClone)
                mockPayRewardErrorRequest(user.id)
            })
            it('Fail case due to not being able to communicate with the Ethereum component', async () => {
                //TODO:Ahora esta generando la recompensa pero no está llevando control sobre si la recompensa se completa o no. Eso seria deseable
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referral', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
            })
        })
    })
    describe('Share reward', async () => {
        context('The ethereum BE is reachable', async () => {
            let user, goal, offer
            beforeEach(async () => {
                const createUserClone = _.cloneDeep(createUser)
                const createGoalClone = _.cloneDeep(createGoal)
                const createOfferClone = _.cloneDeep(createOffer)
                user = await factory.create('user', createUserClone)
                createOfferClone.userId = user.id
                offer = await factory.create('offer', createOfferClone)
                createGoalClone.amount = 40
                createGoalClone.code = 'share'
                goal = await factory.create('goal', createGoalClone)
                mockPayRewardOkRequest(user.id)
            })
            it('OK case', async () => {
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'share', user, offer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                const updatedOffer = await Offer.getAsync(offer.id)
                if (!updatedUserGoals || !updatedOffer) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
                expect(updatedOffer.shared).to.eq(true)
            })
            it('OK case with pre existent UserGoal', async () => {
                await factory.create('usergoal', { code: 'share', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'share', user, offer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                const updatedOffer = await Offer.getAsync(offer.id)
                if (!updatedUserGoals || !updatedOffer) { return }
                expect(updatedUserGoals[0].quantity).to.eq(3)
                expect(updatedOffer.shared).to.eq(true)
            })
            it('Fail case with an already shared offer', async () => {
                const createOfferClone = _.cloneDeep(createOffer)
                createOfferClone.userId = user.id
                createOfferClone.shared = true
                const sharedOffer = await factory.create('offer', createOfferClone)
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'share', user, offer: sharedOffer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                const updatedOffer = await Offer.getAsync(sharedOffer.id)
                if (!updatedUserGoals || !updatedOffer) { return }
                expect(updatedUserGoals.length).to.eq(0)
                expect(updatedOffer.shared).to.eq(true)
            })
            it('Fail case with wrong stimulus', async () => {
                await factory.create('usergoal', { code: 'share', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'sharell', user, offer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(2)
            })
        })
        context('The ethereum BE isn´t reachable', async () => {
            let user, offer
            beforeEach(async () => {
                const createUserClone = _.cloneDeep(createUser)
                const createGoalClone = _.cloneDeep(createGoal)
                const createOfferClone = _.cloneDeep(createOffer)
                user = await factory.create('user', createUserClone)
                createOfferClone.userId = user.id
                offer = await factory.create('offer', createOfferClone)
                createGoalClone.amount = 40
                createGoalClone.code = 'share'
                factory.create('goal', createGoalClone)
                mockPayRewardErrorRequest(user.id)
            })
            it('Fail case due to not being able to communicate with the Ethereum component', async () => {
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'share', user, offer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                const updatedOffer = await Offer.getAsync(offer.id)
                if (!updatedUserGoals || !updatedOffer) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
                expect(updatedOffer.shared).to.eq(true)
            })
        })
    })
    describe('Signup reward', async () => {
        context('The ethereum BE is reachable', async () => {
            let user
            beforeEach(async () => {
                const createUserClone: any = _.cloneDeep(createUser)
                const createGoalClone = _.cloneDeep(createGoal)
                user = await factory.create('user', createUserClone)
                createGoalClone.code = 'signup'
                const goal = await factory.create('goal', createGoalClone)
                mockSignUpOkRequest()
            })
            it('OK case', async () => {
                await signup.handleRequest({ code: 'signup', user, userGoals: [] })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
            })
            it('Fail case due to old user', async () => {
                const createUserClone: any = _.cloneDeep(createUser)
                createUserClone.email = 'old@user.com'
                createUserClone.createdAt = '2019-06-01 19:52:00.578-03'
                const oldUser = await factory.create('user', createUserClone)
                await signup.handleRequest({ code: 'signup', user: oldUser, userGoals: [] })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals.length).to.eq(0)
            })
            it('Fail case due to invalid stimulus', async () => {
                await signup.handleRequest({ code: 'signuppp', user, userGoals: [] })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals.length).to.eq(0)
            })
        })
        context('The ethereum BE isn´t reachable', async () => {
            let user
            beforeEach(async () => {
                const createUserClone: any = _.cloneDeep(createUser)
                const createGoalClone = _.cloneDeep(createGoal)
                user = await factory.create('user', createUserClone)
                createGoalClone.code = 'signup'
                await factory.create('goal', createGoalClone)
                mockSignUpErrorRequest()
            })
            it('Fail case due to not being able to communicate with the Ethereum component', async () => {
                await signup.handleRequest({ code: 'signup', user, userGoals: [] })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
            })
        })
    })
    //TODO: Probar el mecanismo de delegacion entre eslabones de la cadena
})
