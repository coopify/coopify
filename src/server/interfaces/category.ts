import { Category, CategoryAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'

export async function getAsync(id: string): Promise<Category | null> {
    try {
        const categoryInstance = await Category.getAsync(id)

        return categoryInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: object): Promise<Category[] | null> {
    try {
        const categoryInstances = await Category.getManyAsync(where)

        return categoryInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findOneAsync(where: object): Promise<Category | null> {
    try {
        const categoryInstances = await Category.getOneAsync(where)

        return categoryInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: CategoryAttributes): Promise<Category | null> {
    try {
        const categoryInstance = await Category.createAsync(body)
        if (!categoryInstance) { throw new ErrorPayload(500, 'Failed to create offer') }

        return getAsync(categoryInstance.id)
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
