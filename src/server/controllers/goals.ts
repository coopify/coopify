import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import * as moment from 'moment'
import { GoalInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth, sendgrid } from '../services'
import { Category, Goal } from '../models'
import { ErrorPayload } from '../errorPayload'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const goal = await GoalInterface.getAsync(id)

        if (!goal) { return response.status(404).json(new ErrorPayload(404, 'Goal not found')) }

        response.locals.goal = goal
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const goal: Goal = response.locals.goal
        if (!goal) { throw new ErrorPayload(404, 'Goal not found') }

        const bodyResponse = { goal: Goal.toDTO(goal) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const goals = await GoalInterface.findAsync({})
        if (!goals) { throw new ErrorPayload(500, 'Failed to get goals') }

        const bodyResponse = { goals: goals.map((g) => Goal.toDTO(g)) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const { name, description, amount } = request.body
        if (!name || !description || !amount) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const goalToCreate = await GoalInterface.createAsync({
            name,
            description,
            amount,
        })

        if (!goalToCreate) { throw new ErrorPayload(500, 'Failed to create a new goal') }

        const bodyResponse = { goal: Goal.toDTO(goalToCreate) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function getUserGoalsAsync(request: Request, response: Response) {
    const loggedUser = response.locals.loggedUser
    if (!loggedUser) { throw new ErrorPayload(404, 'User not found') }

    const userGoals = await GoalInterface.findUserGoalsAsync({ where: { userId: loggedUser.userId } })
    if (!userGoals) { throw new ErrorPayload(500, 'Failed to get goals') }

    const bodyResponse = { goals: userGoals.map((g) => Goal.toDTO(g)) }
    response.status(200).json(bodyResponse)
}

function handleError(error: ErrorPayload | Error, response: Response) {
    logger.error(error + ' - ' + JSON.stringify(error))
    if (error instanceof ErrorPayload) {
        response.status(error.code).json(error)
    } else {
        response.status(500).json(new ErrorPayload(500, 'Something went wrong', error))
    }
}