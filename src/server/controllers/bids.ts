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
        //const bid =  await BidInterface.getAsync(id)

        //if (!bid) { return response.status(404).json(new ErrorPayload(404, 'Bid not found')) }

        //response.locals.bid = bid
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