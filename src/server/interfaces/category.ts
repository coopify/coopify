import { Category, CategoryAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Category> {
    try {
        const categoryInstance = await Category.getAsync(id)
        if (!categoryInstance) { throw new ErrorPayload(404, 'Category not found') }

        return categoryInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: object): Promise<Category[]> {
    try {
        const categoryInstances = await Category.getManyAsync(where)
        if (!categoryInstances) { throw new ErrorPayload(500, 'Could not get categories') }

        return categoryInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: object): Promise<Category | null> {
    try {
        const categoryInstance = await Category.getOneAsync(where)
        //if (!categoryInstance) { throw new ErrorPayload(404, 'Category not found') }

        return categoryInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: CategoryAttributes): Promise<Category> {
    try {
        const categoryInstance = await Category.createAsync(body)
        if (!categoryInstance) { throw new ErrorPayload(500, 'Failed to create offer') }

        return categoryInstance
    } catch (error) {
        throw handleError(error)
    }
}
