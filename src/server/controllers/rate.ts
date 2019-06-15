import { NextFunction, Request, Response } from 'express'
import { RateInterface, ProposalInterface } from '../interfaces'
import { Rate, Offer, User, Proposal } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const rate = await RateInterface.getAsync(id)

        response.locals.rate = rate
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const rate: Rate = response.locals.rate
        response.status(200).json({ rate: Rate.toDTO(rate) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const { reviewedUserId, offerId } = request.query
        let rates: Rate[]
        if (reviewedUserId && offerId) {
            rates = await RateInterface.findAsync({ reviewedUserId, offerId })
        } else {
            if (reviewedUserId) {
                rates = await RateInterface.findAsync({ reviewedUserId })
            } else {
                if (offerId) {
                    rates = await RateInterface.findAsync({ offerId })
                } else {
                    rates = await RateInterface.findAsync({})
                }
            }
        }
        response.status(200).json({ rates: rates.map((q) => Rate.toDTO(q)) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function reviewableAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const offer: Offer = response.locals.offer
        const validProposal = await ProposalInterface.validateReviewAsync(loggedUser.id, offer.id)
        response.status(200).json({ shouldReview: validProposal !== null })
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const offer: Offer = response.locals.offer
        const { description, rate } = request.body
        if (!description || !rate) { throw new ErrorPayload(400, 'Missing required data') }
        const validProposal = await ProposalInterface.validateReviewAsync(loggedUser.id, offer.id)
        if (!validProposal) { throw new ErrorPayload(400, 'You need an accepted proposal to make a review') }

        const dbRate = await RateInterface.createAsync({
            description,
            offerId: offer.id,
            proposalId: validProposal.id,
            rate,
            reviewedUserId: offer.userId,
            reviewerUserId: loggedUser.id,
        })
        dbRate.reviewerUser = loggedUser

        response.status(200).json({ rate: Rate.toDTO(dbRate) })
    } catch (error) {
        handleError(error, response)
    }
}
