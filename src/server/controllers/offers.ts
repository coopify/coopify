import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import * as moment from 'moment'
import { OfferInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth, sendgrid } from '../services'
import { User, Offer } from '../models'
import { ErrorPayload } from '../errorPayload'

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
        const offers = await OfferInterface.findAsync({})
        if (!offers) { throw new ErrorPayload(500, 'Failed to get offers') }

        const bodyResponse = { offers: offers.map((o) => Offer.toDTO(o)) }
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
            prices: request.body.prices
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