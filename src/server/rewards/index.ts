import { ShareReward } from './shareReward'
import { IReward } from './IReward'
import { User, Offer } from '../models'

const rewardsMechanism: IReward = new ShareReward()
const UserGoalsInterface: any = new Object()

export async function handleRequest(code: string, user: User, offer: Offer) {
    const userGoals = await UserGoalsInterface.findAsync({ userId: user.id })
    rewardsMechanism.handleRequest({ code, user, offer, userGoals })
}
