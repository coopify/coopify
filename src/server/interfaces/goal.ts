import { Goal, GoalAttributes, UserGoal, UserGoalAttributes, UserGoalUpdatedAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Goal> {
    try {
        const goalInstance = await Goal.getAsync(id)
        if (!goalInstance) { throw new ErrorPayload(404, 'Goal not found') }

        return goalInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: object, limit?: number, skip?: number): Promise<{ rows: Goal[], count: number }> {
    try {
        const goalInstances = await Goal.getManyAsync(where, limit, skip)
        if (!goalInstances) { throw new ErrorPayload(500, 'Failed to get goals') }

        return goalInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: object): Promise<Goal | null> {
    try {
        const goalInstances = await Goal.getOneAsync(where)
        //if (!goalInstances) { throw new ErrorPayload(404, 'Goal not found') }

        return goalInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findUserGoalsAsync(where: object): Promise<UserGoal[]> {
    try {
        const goalInstances = await UserGoal.getManyAsync(where)
        if (!goalInstances) { throw new ErrorPayload(500, 'Failed to get user goals') }

        return goalInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: GoalAttributes): Promise<Goal> {
    try {
        const goalInstance = await Goal.createAsync(body)
        if (!goalInstance) { throw new ErrorPayload(500, 'Failed to create goal') }

        return goalInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function addUserGoalAsync(body: UserGoalAttributes): Promise<UserGoal> {
    try {
        const userGoalInstance = await UserGoal.createAsync(body)
        if (!userGoalInstance) { throw new ErrorPayload(500, 'Failed to add a goal to a user') }
        return userGoalInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function updateUserGoalAsync(userGoal: UserGoal, body: UserGoalUpdatedAttributes): Promise<UserGoal> {
    try {
        const userGoalInstance = await UserGoal.updateAsync(userGoal, body)
        if (!userGoalInstance) { throw new ErrorPayload(500, 'Failed to update user goal') }
        return userGoalInstance
    } catch (error) {
        throw handleError(error)
    }
}
