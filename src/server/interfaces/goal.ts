import { Goal, GoalAttributes, UserGoal } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'

export async function getAsync(id: string): Promise<Goal | null> {
    try {
        const goalInstance = await Goal.getAsync(id)

        return goalInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: object, limit?: number, skip?: number): Promise<{ rows: Goal[], count: number } | null> {
    try {
        const goalInstances = await Goal.getManyAsync(where, limit, skip)

        return goalInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findOneAsync(where: object): Promise<Goal | null> {
    try {
        const goalInstances = await Goal.getOneAsync(where)

        return goalInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findUserGoalsAsync(where: object): Promise<UserGoal[] | null> {
    try {
        const goalInstances = await UserGoal.getManyAsync(where)

        return goalInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: GoalAttributes): Promise<Goal> {
    try {
        const goalInstance = await Goal.createAsync(body)
        if (!goalInstance) { throw new ErrorPayload(500, 'Failed to create offer') }

        return goalInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
