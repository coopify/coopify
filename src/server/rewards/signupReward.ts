import { IReward } from './IReward'
import { blockchain, logger } from '../services'
import { User, Offer, UserGoal } from '../models'
import { GoalInterface } from '../interfaces'
import * as moment from 'moment'
import { ReferReward } from './referReward'

interface ISignUpRewardParams {
    code: string,
    user: User,
    offer?: Offer,
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
        const diff = moment(rewardParams.user.createdAt).diff(moment(Date.now()), 'minutes')
        return diff >= 0 && rewardParams.code === this.rewardCode
    }

    public async handleRequest(rewardParams: ISignUpRewardParams): Promise<void> {
        if (this.shouldReward(rewardParams)) {
            logger.info(`Applying the reward for signing up`)
            return this.applyReward(rewardParams)
        } else {
            if (!this.handledReward && this.successor) {
                this.successor.handleRequest(rewardParams)
            }
        }
    }

    public async applyReward(rewardParams: ISignUpRewardParams): Promise<void> {
        try {
            blockchain.signUp(rewardParams.user.id)
            this.handledReward = true
            return this.markRewardAsync(rewardParams)
        } catch (error) {
            logger.error(`SignupReward applyReward => ${JSON.stringify(error)}`)
        }
    }

    public async markRewardAsync(rewardParams: ISignUpRewardParams): Promise<void> {
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
