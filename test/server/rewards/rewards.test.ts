import { ReferReward } from '../../../src/server/rewards/referReward'
import { ShareReward } from '../../../src/server/rewards/shareReward'
import { SignupReward } from '../../../src/server/rewards/signupReward'
import { factory, createUser, createGoal, createUserGoal, createOffer } from '../factory'
import { UserGoal, Offer } from '../../../src/server/models'
import { expect } from 'chai'
import * as _ from 'lodash'
import { mockPayRewardOkRequest } from '../mocks'
import { logger } from '../../../src/server/services'

const refer = new ReferReward()
const share = new ShareReward()
const signup = new SignupReward()

describe('Reward engine ests', async () => {
    describe('Refer reward', async () => {
        context('Category already created', async () => {
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
            it('This one', async () => {
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referral', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
            })
            it('This one', async () => {
                await factory.create('usergoal', { code: 'referral', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referral', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(3)
            })
            it('This one', async () => {
                await factory.create('usergoal', { code: 'referral', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await refer.handleRequest({ code: 'referralll', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(2)
            })
        })
    })
    describe('share reward', async () => {
        context('Category already created', async () => {
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
            it('This one', async () => {
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'share', user, offer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                const updatedOffer = await Offer.getAsync(offer.id)
                if (!updatedUserGoals || !updatedOffer) { return }
                expect(updatedUserGoals[0].quantity).to.eq(1)
                expect(updatedOffer.shared).to.eq(true)
            })
            it('This one', async () => {
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
            it('This one', async () => {
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
            it('This one', async () => {
                await factory.create('usergoal', { code: 'share', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'sharell', user, offer, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(2)
            })
            it('This one', async () => {
                await factory.create('usergoal', { code: 'share', goalId: goal.id, userId: user.id, quantity: 2 })
                const userGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!userGoals) { return }
                await share.handleRequest({ code: 'sharel', user, userGoals })
                const updatedUserGoals = await UserGoal.getManyAsync({ userId: user.id })
                if (!updatedUserGoals) { return }
                expect(updatedUserGoals[0].quantity).to.eq(2)
            })
        })
    })
})
