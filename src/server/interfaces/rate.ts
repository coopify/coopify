import { Rate, RateAttributes } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Rate> {
    try {
        const rateInstance = await Rate.getAsync(id)
        if (!rateInstance) { throw new ErrorPayload(404, 'Rate not found') }

        return rateInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: object): Promise<Rate[]> {
    try {
        const rateInstances = await Rate.getManyAsync(where)
        if (!rateInstances) { throw new ErrorPayload(500, 'Failed to find rates') }

        return rateInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: object): Promise<Rate> {
    try {
        const rateInstances = await Rate.getOneAsync(where)
        if (!rateInstances) { throw new ErrorPayload(500, 'Failed to find a rate') }

        return rateInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: RateAttributes): Promise<Rate> {
    try {
        const rateInstance = await Rate.createAsync(body)
        if (!rateInstance) { throw new ErrorPayload(500, 'Failed to create a rate') }

        return rateInstance
    } catch (error) {
        throw handleError(error)
    }
}
