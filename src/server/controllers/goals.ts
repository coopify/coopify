import { NextFunction, Request, Response } from 'express'
import { GoalInterface } from '../interfaces'
import { Goal } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'
import { logger } from '../services'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const goal = await GoalInterface.getAsync(id)

        response.locals.goal = goal
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const goal: Goal = response.locals.goal

        response.status(200).json({ goal: Goal.toDTO(goal) })
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

        response.status(200).json({ goals: goals.rows.map((g) => Goal.toDTO(g)), count: goals.count })
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

        response.status(200).json({ goal: Goal.toDTO(goalToCreate) })
    } catch (error) {
        handleError(error, response)
    }
}
