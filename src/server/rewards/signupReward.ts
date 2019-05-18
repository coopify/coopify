import { IReward } from './IReward'
import { blockchain } from '../services'
import { User, Offer } from '../models'
import { ErrorPayload } from '../errorPayload'
import { OfferInterface } from '../interfaces'
import * as moment from 'moment'

interface IShareRewardParams {
    code: string,
    user: User,
    offer: Offer,
    userGoals: any[]
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
        //this.successor = new ShareReward()
    }

    public shouldReward(rewardParams: IShareRewardParams): boolean {
        //Check the previous userGoals and check that the goal was not met
        const result = moment(rewardParams.user.createdAt).diff(moment(Date.now()), 'minutes') < 1
        return result && rewardParams.code === this.rewardCode
    }

    public handleRequest(rewardParams: IShareRewardParams) {
        if (this.shouldReward(rewardParams)) {
            this.applyReward(rewardParams)
        } else {
            if (!this.handledReward && this.successor) {
                this.successor.handleRequest(rewardParams)
            }
        }
    }

    public applyReward(rewardParams: IShareRewardParams) {
        blockchain.reward({
            amount: this.rewardAmount,
            concept: 'Payment for signing up',
            to: rewardParams.user,
        })
        this.handledReward = true
        this.markRewardAsync(rewardParams)
    }

    public async markRewardAsync(rewardParams: IShareRewardParams) {
        const rewardToUpdate = rewardParams.userGoals.find((r) => r.userId === rewardParams.user.id && r.code === this.rewardCode)
        if (!rewardToUpdate) {
            //TODO: reevaluar esto, puede que haya q crearla
            throw new ErrorPayload(404, 'Goal not found')
        } else {
            await OfferInterface.updateAsync(rewardParams.offer, { shared: true })
            //rewardToUpdate.achieved = true
            //rewardToUpdate.save()
        }
    }

}
