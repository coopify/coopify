import { ShareReward } from './shareReward'
import { IReward } from './IReward'
import { User, Offer } from '../models'
import { GoalInterface } from '../interfaces'
import { ErrorPayload } from '../errorPayload'

const rewardsMechanism: IReward = new ShareReward()

export async function handleRequest(code: string, user: User, offer?: Offer) {
    const userGoals = await GoalInterface.findUserGoalsAsync({ userId: user.id })
    if (!userGoals) { throw new ErrorPayload(500, 'Failed to communicate with the db') }
    rewardsMechanism.handleRequest({ code, user, offer, userGoals })
}
