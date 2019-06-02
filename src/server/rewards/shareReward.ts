import { IReward } from './IReward'
import { blockchain, logger } from '../services'
import { User, Offer, UserGoal } from '../models'
import { OfferInterface, GoalInterface } from '../interfaces'
import { SignupReward } from './signupReward'

interface IShareRewardParams {
    code: string,
    user: User,
    offer?: Offer,
    userGoals: UserGoal[]
}

export class ShareReward implements IReward {
    public rewardCode: string
    public rewardAmount: number
    public successor?: IReward
    private handledReward: boolean

    constructor() {
        this.rewardCode = 'share'
        this.rewardAmount = 20
        this.handledReward = false
        this.successor = new SignupReward()
    }

    public shouldReward(rewardParams: IShareRewardParams): boolean {
        //Check the previous userGoals and check that the goal was not met
        const result = rewardParams.offer ? !rewardParams.offer.shared && rewardParams.code === this.rewardCode : false
        return result
    }

    public async handleRequest(rewardParams: IShareRewardParams): Promise<void> {
        if (this.shouldReward(rewardParams)) {
            return this.applyReward(rewardParams)
        } else {
            if (!this.handledReward && this.successor) {
                this.successor.handleRequest(rewardParams)
            }
        }
    }

    public async applyReward(rewardParams: IShareRewardParams): Promise<void> {
        blockchain.reward({
            amount: this.rewardAmount,
            concept: 'Payment for sharing a service on social media',
            to: rewardParams.user,
        })
        this.handledReward = true
        return this.markRewardAsync(rewardParams)
    }

    public async markRewardAsync(rewardParams: IShareRewardParams) {
        try {
            const userGoalToUpdate = rewardParams.userGoals.find((r) => r.userId === rewardParams.user.id && r.code === this.rewardCode)
            if (!userGoalToUpdate) {
                const goal = await GoalInterface.findOneAsync({ code: this.rewardCode })
                if (goal) {
                    await GoalInterface.addUserGoalAsync({
                        code: this.rewardCode,
                        goalId: goal.id,
                        quantity: 1,
                        userId: rewardParams.user.id,
                    })
                }
            } else {
                userGoalToUpdate.quantity = userGoalToUpdate.quantity + 1
                await GoalInterface.updateUserGoalAsync(userGoalToUpdate, userGoalToUpdate)
            }
            if (rewardParams.offer) {
                await OfferInterface.updateAsync(rewardParams.offer, { shared: true })
            }
        } catch (error) {
            logger.error(`ShareReward markRewardAsync => ${JSON.stringify(error)}`)
        }
    }

}
