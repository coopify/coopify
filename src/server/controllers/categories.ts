import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import * as moment from 'moment'
import { CategoryInterface } from '../interfaces'
import { handleError } from './helpers'
import { Category } from '../models'
import { ErrorPayload } from '../errorPayload'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const category = await CategoryInterface.getAsync(id)

        response.locals.category = category
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const category: Category = response.locals.category

        response.status(200).json({ category: Category.toDTO(category) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const categories = await CategoryInterface.findAsync({})

        response.status(200).json({ categories: categories.map((c) => Category.toDTO(c)) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const name = request.body.name
        if (!name) {
            throw new ErrorPayload(400, 'Missing required data')
        }

        const categoryToCreate = await CategoryInterface.createAsync({
            name,
            deleted: false,
        })

        response.status(200).json({ category: Category.toDTO(categoryToCreate) })
    } catch (error) {
        handleError(error, response)
    }
}
