import { NextFunction, Request, Response } from 'express'
import { OfferInterface, QuestionInterface } from '../interfaces'
import { facebook } from '../services'
import { IServiceFilter, Offer, Question, User } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const offer = await OfferInterface.getAsync(id)

        response.locals.offer = offer
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const offer: Offer = response.locals.offer

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
        const offers = await OfferInterface.findFilteredAsync(filterParams, limit, skip)
        response.status(200).json({ offers: offers.rows.map((o) => Offer.toDTO(o)), count: offers.count })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getFromUserAsync(request: Request, response: Response) {
    try {
        const user: User = response.locals.user
        let { limit, skip } = request.query
        if (limit) { limit = parseInt(limit) }
        if (skip) { skip = parseInt(skip) }
        if (limit && skip) { skip = limit * skip }
        const offers = await OfferInterface.findAsync({ userId: user.id }, limit, skip)
        response.status(200).json({ offers: offers.rows.map((o) => Offer.toDTO(o)), count: offers.count })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getQuestionsListAsync(request: Request, response: Response) {
    try {
        let { limit, skip } = request.query
        if (limit) { limit = parseInt(limit) }
        if (skip) { skip = parseInt(skip) }
        if (limit && skip) { skip = limit * skip }
        const offerQuestions = await QuestionInterface.findAsync({ offerId: response.locals.offer.id }, limit, skip)
        response.status(200).json({ questions: offerQuestions.rows.map((q) => Question.toDTO(q)), count: offerQuestions.count })
    } catch (error) {
        handleError(error, response)
    }
}

export async function countInteractionsAsync(request: Request, response: Response) {
    try {
        const user: User = response.locals.loggedUser
        const { uri } = request.query
        if (!uri) { throw new ErrorPayload(400, 'Missing required data') }
        const count = await facebook.getPostStatsAsync(user.FBAccessToken, uri)
        response.status(200).json({ count })
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
            categories: request.body.categories,
            paymentMethod: request.body.paymentMethod,
            startDate: request.body.startDate,
            finishDate: request.body.finishDate,
            status: request.body.status,
            exchangeInstances: request.body.exchangeMethod,
            hourPrice: request.body.hourPrice ? parseInt(request.body.hourPrice) : request.body.hourPrice,
            sessionPrice: request.body.sessionPrice ? parseInt(request.body.sessionPrice) : request.body.sessionPrice,
            finalProductPrice: request.body.finalProductPrice ? parseInt(request.body.finalProductPrice) : request.body.finalProductPrice,
        })

        response.status(200).json({ offer: Offer.toDTO(offerToCreate) })
    } catch (error) {
        handleError(error, response)
    }
}

function processQueryInput(queryParams: any): IServiceFilter {
    const { lowerPrice, upperPrice, name, categories, paymentMethods, exchangeMethods, orderBy } = queryParams
    const filters: IServiceFilter = {}
    if (name) { filters.name = name }
    if (orderBy) { filters.orderBy = orderBy }
    if (lowerPrice && parseInt(lowerPrice) > 0) { filters.lowerPrice = parseInt(lowerPrice) }
    if (upperPrice && parseInt(upperPrice) > 0) { filters.upperPrice = parseInt(upperPrice) }
    if (paymentMethods) {
        if (paymentMethods instanceof Array) {
            filters.paymentMethods = paymentMethods
        } else {
            filters.paymentMethods = [paymentMethods]
        }
    }
    if (exchangeMethods) {
        if (exchangeMethods instanceof Array) {
            filters.exchangeMethods = exchangeMethods
        } else {
            filters.exchangeMethods = [exchangeMethods]
        }
    }
    if (categories) {
        if (categories  instanceof Array) {
            filters.categories = categories
        } else {
            filters.categories = [categories]
        }
    }

    return filters
}
