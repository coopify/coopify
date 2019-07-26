import { Offer, OfferAttributes, OfferUpdateAttributes, OfferCategory, IServiceFilter } from '../models'
import { validateStatus, validatePaymentMethod } from './helpers'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { CategoryInterface } from '.'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Offer> {
    try {
        const offerInstance = await Offer.getAsync(id)
        if (!offerInstance) { throw new ErrorPayload(404, 'Offer not found') }

        return offerInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findFilteredAsync(where: IServiceFilter, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number }> {
    try {
        const offerInstances = await Offer.getFilteredAsync(where, limit, skip)
        if (!offerInstances) { throw new ErrorPayload(500, 'Failed to get filtered offers') }

        return offerInstances
    } catch (error) {
        logger.error(new Error(error) + JSON.stringify(error))
        throw error
    }
}

export async function findAsync(where: any, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number }> {
    try {
        const offerInstances = await Offer.getManyAsync(where, limit, skip)
        if (!offerInstances) { throw new ErrorPayload(500, 'Failed to get offers') }

        return offerInstances
    } catch (error) {
        logger.error(new Error(error) + JSON.stringify(error))
        throw error
    }
}

export async function findOneAsync(where: IServiceFilter): Promise<Offer | null> {
    try {
        const offerInstance = await Offer.getOneAsync(where)
        //if (!offerInstance) { throw new ErrorPayload(404, 'Offer not found') }

        return offerInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: OfferAttributes): Promise<Offer> {
    try {
        if (body.paymentMethod) { validatePaymentMethod(body.paymentMethod) }
        if (body.status) { validateStatus(body.status) }
        body.shared = false
        if ( body.hourPrice && body.hourPrice < 0) { throw new ErrorPayload(400, 'Invalid price for hour') }
        if ( body.sessionPrice && body.sessionPrice < 0) { throw new ErrorPayload(400, 'Invalid price for session') }
        if ( body.finalProductPrice && body.finalProductPrice < 0) { throw new ErrorPayload(400, 'Invalid price for final product') }
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
        throw handleError(error)
    }
}

export async function updateAsync(offer: Offer, body: OfferUpdateAttributes, transaction?): Promise<Offer> {
    try {
        const offerInstance = await Offer.updateAsync(offer, body, transaction)
        if (!offerInstance) { throw new ErrorPayload(500, 'Failed to update offer') }
        return offerInstance
    } catch (error) {
        throw handleError(error)
    }
}
