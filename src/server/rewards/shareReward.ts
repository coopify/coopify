import { IReward } from './IReward'
import { blockchain } from '../services'
import { User, Offer } from '../models'
import { ErrorPayload } from '../errorPayload'
import { OfferInterface } from '../interfaces'
import { SignupReward } from './signupReward'

interface IShareRewardParams {
    code: string,
    user: User,
    offer: Offer,
    userGoals: any[]
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
        const result = rewardParams.offer.shared && rewardParams.code === this.rewardCode
        return result
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
            concept: 'Payment for sharing a service on social media',
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
