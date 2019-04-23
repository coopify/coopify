import { Offer, OfferAttributes, OfferCategory, IServiceFilter } from '../models'
import { validateStatus, validatePaymentMethod } from './helpers'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { CategoryInterface } from '.'

export async function getAsync(id: string): Promise<Offer | null> {
    try {
        const offerInstance = await Offer.getAsync(id)

        return offerInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: IServiceFilter | any, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
    try {
        const offerInstances = await Offer.getManyAsync(where, limit, skip)

        return offerInstances
    } catch (error) {
        logger.error(new Error(error) + JSON.stringify(error))
        throw error
    }
}

export async function findOneAsync(where: IServiceFilter): Promise<Offer | null> {
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
        if (body.categories) {
            await Promise.all(body.categories.map(async (c) => {
                const cat = await CategoryInterface.findOneAsync({ name: c })
                if (!cat) { throw new ErrorPayload(404, 'Failed to get category') }
                await OfferCategory.createAsync({ categoryId: cat.id, offerId: offerInstance.id })
            }))
        }
        return getAsync(offerInstance.id)
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

//In the Offer update use the paymentMethod validation and the status validation
