import { IReward } from './IReward'
import { blockchain, logger } from '../services'
import { User, Offer, UserGoal } from '../models'
import { GoalInterface } from '../interfaces'
import * as moment from 'moment'
import { ReferReward } from './referReward'

interface ISignUpRewardParams {
    code: string,
    user: User,
    offer: Offer,
    userGoals: UserGoal[]
}

export class SignupReward implements IReward {
    public rewardCode: string
    public rewardAmount: number
    public successor?: IReward
    private handledReward: boolean

    constructor() {
        this.rewardCode = 'signup'
        this.rewardAmount = 40
        this.handledReward = false
        this.successor = new ReferReward()
    }

    public shouldReward(rewardParams: ISignUpRewardParams): boolean {
        //Check the previous userGoals and check that the goal was not met
        const result = moment(rewardParams.user.createdAt).diff(moment(Date.now()), 'minutes') < 1
        return result && rewardParams.code === this.rewardCode
    }

    public handleRequest(rewardParams: ISignUpRewardParams) {
        if (this.shouldReward(rewardParams)) {
            logger.info(`Applying the reward for signing up`)
            this.applyReward(rewardParams)
        } else {
            if (!this.handledReward && this.successor) {
                this.successor.handleRequest(rewardParams)
            }
        }
    }

    public applyReward(rewardParams: ISignUpRewardParams) {
        try {
            blockchain.reward({
                amount: this.rewardAmount,
                concept: 'Payment for signing up',
                to: rewardParams.user,
            })
            this.handledReward = true
            this.markRewardAsync(rewardParams)
        } catch (error) {
            logger.error(`SignupReward applyReward => ${JSON.stringify(error)}`)
        }
    }

    public async markRewardAsync(rewardParams: ISignUpRewardParams) {
        try {
            const rewardToUpdate = rewardParams.userGoals.find((r) => r.userId === rewardParams.user.id && r.code === this.rewardCode)
            if (!rewardToUpdate) {
                const goal = await GoalInterface.findOneAsync({ code: this.rewardCode })
                if (goal) {
                    await GoalInterface.addUserGoalAsync({
                        code: this.rewardCode,
                        goalId: goal.id,
                        quantity: 1,
                        userId: rewardParams.user.id,
                    })
                }
            }
        } catch (error) {
            logger.error(`SignupReward markRewardAsync => ${JSON.stringify(error)}`)
        }
    }

}
