import { Bid, BidAttributes } from '../models'
import { validateStatus, validatePaymentMethod } from './helpers'
import { logger } from '../services'

export async function getAsync(id: string): Promise<Bid | null> {
    try {
        const bidInstance = await Bid.getAsync(id)

        return bidInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: object): Promise<Bid[] | null> {
    try {
        const bidInstances = await Bid.getManyAsync(where)

        return bidInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findOneAsync(where: object): Promise<Bid | null> {
    try {
        const bidInstances = await Bid.getOneAsync(where)

        return bidInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: BidAttributes): Promise<Bid | null> {
    try {
        if (body.paymentMethod) { validatePaymentMethod(body.paymentMethod) }
        if (body.status) { validateStatus(body.status) }
        //TODO in future: validate categories
        const bidInstance = await Bid.createAsync(body)

        return bidInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

//In the bid update use the paymentMethod validation and the status validation

