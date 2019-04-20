import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { Response } from 'express'

export function handleError(error: ErrorPayload | Error, response: Response) {
    logger.error(error + ' - ' + JSON.stringify(error))
    if (error instanceof ErrorPayload) {
        response.status(error.code).json(error)
    } else {
        response.status(500).json(new ErrorPayload(500, 'Something went wrong', error))
    }
}
