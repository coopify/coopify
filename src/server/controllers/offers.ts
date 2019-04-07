import { NextFunction, Request, Response } from 'express'
import { OfferInterface } from '../interfaces'
import { logger } from '../services'
import { IServiceFilter, Offer } from '../models'
import { ErrorPayload } from '../errorPayload'
import { parse } from 'query-string'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const offer = await OfferInterface.getAsync(id)

        if (!offer) { return response.status(404).json(new ErrorPayload(404, 'Offer not found')) }

        response.locals.offer = offer
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const offer: Offer = response.locals.offer
        if (!offer) { throw new ErrorPayload(404, 'Offer not found') }

        const bodyResponse = { offer: Offer.toDTO(offer) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        let { limit, skip } = request.query
        if (limit) { limit = parseInt(limit) }
        if (skip) { skip = parseInt(skip) }
        if (limit && skip) { skip = limit * skip }
        const filterParams = processQueryInput(request.query)
        const offers = await OfferInterface.findAsync(filterParams, limit, skip)
        if (!offers) { throw new ErrorPayload(500, 'Failed to get offers') }
        const bodyResponse = { offers: offers.rows.map((o) => Offer.toDTO(o)), count: offers.count }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const loggedId = response.locals.loggedUser.id
        const { images, paymentMethod, startDate, status } = request.body
        if (!images || !paymentMethod || !startDate || !status) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const offerToCreate = await OfferInterface.createAsync({
            userId: loggedId,
            title: request.body.title,
            description: request.body.description,
            images: request.body.images,
            category: request.body.category,
            paymentMethod: request.body.paymentMethod,
            startDate: request.body.startDate,
            finishDate: request.body.finishDate,
            status: request.body.status,
            prices: request.body.prices,
        })

        if (!offerToCreate) { throw new ErrorPayload(500, 'Failed to create a new offer') }

        const bodyResponse = { offer: Offer.toDTO(offerToCreate) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

function handleError(error: ErrorPayload | Error, response: Response) {
    logger.error(error + ' - ' + JSON.stringify(error))
    if (error instanceof ErrorPayload) {
        response.status(error.code).json(error)
    } else {
        response.status(500).json(new ErrorPayload(500, 'Something went wrong', error))
    }
}

function processQueryInput(queryParams: any): IServiceFilter {
    const { minimunCoopy, maximunCoopy, name, categories, paymentMethods, exchangeInstances, orderBy } = queryParams
    const filters: IServiceFilter = {}
    if (name) { filters.name = name }
    if (orderBy) { filters.orderBy = orderBy }
    if (minimunCoopy && parseInt(minimunCoopy) > 0) { filters.lowerPrice = parseInt(minimunCoopy) }
    if (maximunCoopy && parseInt(maximunCoopy) > 0) { filters.upperPrice = parseInt(maximunCoopy) }
    if (paymentMethods) {
        if (paymentMethods.length && paymentMethods.length > 0) {
            filters.paymentMethods = paymentMethods
        }
    }
    if (exchangeInstances) {
        if (exchangeInstances.length && exchangeInstances.length > 0) {
            filters.exchangeInstances = exchangeInstances
        }
    }

    return filters
}
