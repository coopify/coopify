import { Offer, OfferAttributes } from '../models'
import { validateStatus, validatePaymentMethod } from './helpers'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload';
import { OfferPrice } from '../models/sequelize/offerPrice';

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
        if (!offerInstance) { throw new ErrorPayload(500, 'Failed to create offer') }
        if (body.prices) {
            await Promise.all(body.prices.map(async (p) => {
                p.offerId = offerInstance.id
                await OfferPrice.createAsync(p)
            }))
        }

        return getAsync(offerInstance.id)
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

//In the Offer update use the paymentMethod validation and the status validation

