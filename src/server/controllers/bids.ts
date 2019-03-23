import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import * as moment from 'moment'
import { BidInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth, sendgrid } from '../services'
import { User, Bid } from '../models'
import { ErrorPayload } from '../errorPayload'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const bid =  await BidInterface.getAsync(id)

        if (!bid) { return response.status(404).json(new ErrorPayload(404, 'Bid not found')) }

        response.locals.bid = bid
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function createBidAsync(request: Request, response: Response) {
    try {
        const loggedId = response.locals.loggedUser.userId
        const { images, paymentMethod, startDate, finishDate, status } = request.body
        if (!images || !paymentMethod || !startDate || !finishDate || !status) { 
            throw new ErrorPayload(400, 'Missing required data')
        }

        const bidToCreate = await BidInterface.createAsync({
            userId : loggedId,
            description : request.body.description,
            images : request.body.images,
            category : request.body.category,
            paymentMethod : request.body.paymentMethod,
            startDate : request.body.startDate,
            finishDate : request.body.finishDate,
            status : request.body.status
        })
        
        if (!bidToCreate) { throw new ErrorPayload(500, 'Failed to create a new bid') }

        const bodyResponse = {bid: Bid.toDTO(bidToCreate) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

function handleError(error: ErrorPayload | Error, response: Response){
    logger.error(error + ' - ' + JSON.stringify(error))
    if (error instanceof ErrorPayload) {
        response.status(error.code).json(error)
    } else {
        response.status(500).json(new ErrorPayload(500, 'Something went wrong', error))
    }
}