import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import * as moment from 'moment'
import { CategoryInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth, sendgrid } from '../services'
import { Category } from '../models'
import { ErrorPayload } from '../errorPayload'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const category = await CategoryInterface.getAsync(id)

        if (!category) { return response.status(404).json(new ErrorPayload(404, 'Category not found')) }

        response.locals.category = category
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const category: Category = response.locals.category
        if (!category) { throw new ErrorPayload(404, 'Category not found') }

        const bodyResponse = { category: Category.toDTO(category) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const categories = await CategoryInterface.findAsync({})
        if (!categories) { throw new ErrorPayload(500, 'Failed to get categories') }

        const bodyResponse = { categories: categories.map((c) => Category.toDTO(c)) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const { name, deleted } = request.body
        if (!name || !deleted) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const categoryToCreate = await CategoryInterface.createAsync({
            name: request.body.name,
            deleted: request.body.deleted,
        })

        if (!categoryToCreate) { throw new ErrorPayload(500, 'Failed to create a new category') }

        const bodyResponse = { category: Category.toDTO(categoryToCreate) }
        response.status(200).json(bodyResponse)
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
