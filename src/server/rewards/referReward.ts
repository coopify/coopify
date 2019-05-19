import { IReward } from './IReward'
import { blockchain, logger } from '../services'
import { User, UserGoal } from '../models'
import { GoalInterface } from '../interfaces'

interface IReferRewardParams {
    code: string,
    user: User,
    userGoals: UserGoal[]
}

export class ReferReward implements IReward {
    public rewardCode: string
    public rewardAmount: number
    public successor?: IReward
    private handledReward: boolean

    constructor() {
        this.rewardCode = 'referral'
        this.rewardAmount = 10
        this.handledReward = false
        //this.successor = new ShareReward()
    }

    public shouldReward(rewardParams: IReferRewardParams): boolean {
        return rewardParams.code === this.rewardCode
    }

    public handleRequest(rewardParams: IReferRewardParams) {
        if (this.shouldReward(rewardParams)) {
            this.applyReward(rewardParams)
        } else {
            if (!this.handledReward && this.successor) {
                this.successor.handleRequest(rewardParams)
            }
        }
    }

    public applyReward(rewardParams: IReferRewardParams) {
        try {
            blockchain.reward({
                amount: this.rewardAmount,
                concept: 'Payment for refering ' + rewardParams.user.name + ' ' + rewardParams.user.lastName,
                to: rewardParams.user,
            })
            this.handledReward = true
            this.markRewardAsync(rewardParams)
        } catch (error) {
            logger.error(`ReferReward applyReward => ${JSON.stringify(error)}`)
        }
    }

    public async markRewardAsync(rewardParams: IReferRewardParams) {
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
            } else {
                rewardToUpdate.quantity = rewardToUpdate.quantity + 1
                await GoalInterface.updateUserGoalAsync(rewardToUpdate, rewardToUpdate)
            }
        } catch (error) {
            logger.error(`ReferReward markRewardAsync => ${JSON.stringify(error)}`)
        }
    }
}
