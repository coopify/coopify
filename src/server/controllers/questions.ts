import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import * as moment from 'moment'
import { QuestionInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth, sendgrid } from '../services'
import { Question } from '../models'
import { ErrorPayload } from '../errorPayload'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const question = await QuestionInterface.getAsync(id)

        if (!question) { return response.status(404).json(new ErrorPayload(404, 'Question not found')) }

        response.locals.question = question
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const question: Question = response.locals.question
        if (!question) { throw new ErrorPayload(404, 'Question not found') }

        const bodyResponse = { question: Question.toDTO(question) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const questions = await QuestionInterface.findAsync({})
        if (!questions) { throw new ErrorPayload(500, 'Failed to get questions') }

        const bodyResponse = { questions: questions.map((q) => Question.toDTO(q)) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const loggedId = response.locals.loggedUser.id
        const text = request.body.text
        if (!text) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const questionToCreate = await QuestionInterface.createAsync({
            authorId: loggedId,
            offerId: request.body.offerId,
            text,
        })

        if (!questionToCreate) { throw new ErrorPayload(500, 'Failed to create a new question') }

        const bodyResponse = { question: Question.toDTO(questionToCreate) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function updateAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const questionToUpdate = response.locals.question
        if (!questionToUpdate) { throw new ErrorPayload(404, 'Question not found') }
        const attributes = request.body.attributes
        if (!attributes) { throw new ErrorPayload(403, 'Missing required data') }
        const question = await QuestionInterface.updateAsync(questionToUpdate, attributes)
        if (!question) { throw new ErrorPayload(403, 'Could not update question') }
        response.status(200).json({ question: Question.toDTO(question) })
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
