import { NextFunction, Request, Response } from 'express'
import { GoalInterface } from '../interfaces'
import { Goal } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

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
        let { limit, skip } = request.query
        if (limit) { limit = parseInt(limit) }
        if (skip) { skip = parseInt(skip) }
        if (limit && skip) { skip = limit * skip }

        const goals = await GoalInterface.findAsync({}, limit, skip)
        if (!goals) { throw new ErrorPayload(500, 'Failed to get user goals') }

        if (goals) {
            const bodyResponse = { goals: goals.rows.map((g) => Goal.toDTO(g)), count: goals.count }
            response.status(200).json(bodyResponse)
        }
    } catch (error) {
        handleError(error, response)
    }
}

export async function getUserGoalsAsync(request: Request, response: Response) {
    try {
        const loggedUser = response.locals.loggedUser
        if (!loggedUser) { throw new ErrorPayload(404, 'User not found') }

        let { limit, skip } = request.query
        if (limit) { limit = parseInt(limit) }
        if (skip) { skip = parseInt(skip) }
        if (limit && skip) { skip = limit * skip }
        const userGoals = await GoalInterface.findUserGoalsAsync({ userId: loggedUser.id })
        if (!userGoals) { throw new ErrorPayload(500, 'Failed to get user goals') }
        response.status(200).json(userGoals)
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const { name, description, amount, code } = request.body
        if (!name || !description || !amount || !code) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const goalToCreate = await GoalInterface.createAsync({
            name,
            description,
            amount,
            code,
        })

        if (!goalToCreate) { throw new ErrorPayload(500, 'Failed to create a new goal') }

        const bodyResponse = { goal: Goal.toDTO(goalToCreate) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}
