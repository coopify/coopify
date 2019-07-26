import { NextFunction, Request, Response } from 'express'
import { QuestionInterface, OfferInterface } from '../interfaces'
import { handleError } from './helpers'
import { Question, QuestionUpdateAttributes } from '../models'
import { ErrorPayload } from '../errorPayload'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const question = await QuestionInterface.getAsync(id)

        response.locals.question = question
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const question: Question = response.locals.question

        response.status(200).json({ question: Question.toDTO(question) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const questions = await QuestionInterface.findAsync({})
        response.status(200).json({ questions: questions.rows.map((q) => Question.toDTO(q)), count: questions.count })
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const loggedId = response.locals.loggedUser.id
        const offerId = response.locals.offer.id
        const text = request.body.text
        if (!text) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const questionToCreate = await QuestionInterface.createAsync({
            authorId: loggedId,
            offerId,
            text,
        })

        response.status(200).json({ question: Question.toDTO(questionToCreate) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function updateAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const questionToUpdate = response.locals.question
        const question = await QuestionInterface.getAsync(questionToUpdate.id)
        if (!question) { throw new ErrorPayload(404, 'Question not found') }
        const offer = await OfferInterface.getAsync(question.offerId)

        if (offer && response.locals.loggedUser.id === offer.userId) {
            const attributes: QuestionUpdateAttributes = request.body.attributes
            if (!attributes) { throw new ErrorPayload(403, 'Missing required data') }
            if (attributes.response === '') { throw new ErrorPayload(403, 'Should provide a response') }
            const updatedQuestion = await QuestionInterface.updateAsync(questionToUpdate, attributes)
            response.status(200).json({ question: Question.toDTO(updatedQuestion) })
        } else {
            throw new ErrorPayload(403, 'User does not own this offer')
        }

    } catch (error) {
        handleError(error, response)
    }
}
