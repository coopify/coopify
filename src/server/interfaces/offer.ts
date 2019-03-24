import { Offer, OfferAttributes, Offer_Price } from '../models'
import { validateStatus, validatePaymentMethod } from './helpers'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'

export async function getAsync(id: string): Promise<Offer | null> {
    try {
        const offerInstance = await Offer.getAsync(id)

        return offerInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: object): Promise<Offer[] | null> {
    try {
        const offerInstances = await Offer.getManyAsync(where)

        return offerInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findOneAsync(where: object): Promise<Offer | null> {
    try {
        const offerInstances = await Offer.getOneAsync(where)

        return offerInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: OfferAttributes): Promise<Offer | null> {
    try {
        if (body.paymentMethod) { validatePaymentMethod(body.paymentMethod) }
        if (body.status) { validateStatus(body.status) }
        //TODO in future: validate categories
        const offerInstance = await Offer.createAsync(body)
        if (!offerInstance) { throw new ErrorPayload(500, 'Failed to create an offer') }
        if (body.prices) {
            await Promise.all(body.prices.map(async (price) => {
                price.offerId = offerInstance.id
                await Offer_Price.createAsync(price)
            }))
        }
        return getAsync(offerInstance.id)
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
