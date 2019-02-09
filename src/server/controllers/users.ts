import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { UserInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth } from '../services'
import { User, userDTO } from '../models'
import { ErrorPayload } from '../errorPayload'
import { isValidEmail } from '../../../lib/validations'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const user =  await UserInterface.getAsync(id)

        if (!user) { return response.status(404).json(new ErrorPayload(404, 'User not found')) }

        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export function getFacebookAuthURLAsync(request: Request, response: Response) {
    try {
        const url = facebook.generateAuthUrl()
        response.status(200).json({ url })
        response.send()
    } catch (error) {
        handleError(error, response)
    }
}

export async function exchangeFacebookCodeAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const code = request.body.code
        if (!code) { throw new ErrorPayload(400, 'Should provide a code to exchange') }
        const tokens = await facebook.exchangeCodeAsync(code)
        const userData = await facebook.getUserDataAsync(tokens.access_token)
        delete userData.id
        const user = await UserInterface.createFromIPAsync(userData, tokens)
        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function signupAsync(request: Request, response: Response, next: NextFunction) {
    try {
        if (!isValidEmail(request.body.email)) { return response.status(404).json(new ErrorPayload(400, 'Invalid email')) }
        const users = await UserInterface.findAsync({ email : request.body.email })

        if (users && users.length > 0) { return response.status(404).json(new ErrorPayload(404, 'Email already in use')) }

        const user =  await UserInterface.createAsync(request.body)

        if (!user) { return response.status(404).json(new ErrorPayload(404, 'Failed to create user')) }
        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}
//Agus
export async function googleAPIURLAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const url = googleAuth.generateAuthURI()
        response.status(200).json({ url })
        response.send()
    } catch (error) {
        logger.error(error)
        response.status(400).json(new ErrorPayload(400, error))
    }
}

export async function googleAPIExchangeCodeForTokenAsync(request: Request, response: Response, next: NextFunction) {
    try {
        //No se si el code va en el body o en el header y ademas ver si hay que hacer alguna validacion
        //Por ejemplo si el code es vacio
        const code = request.body.code
        googleAuth.ExchangeCodeForToken(code)
    } catch (error) {
        logger.error(error)
        response.status(400).json(new ErrorPayload(400, error))
    }
}
//fin AGus

export async function generateTokenAsync(request: Request, response: Response, next: NextFunction) {
    const user: User = response.locals.user
    const payload = { userId: user.id }

    try {
        const accessToken = sign(payload, 'someKeyToSubstitute')
        await redisCache.saveAccessTokenAsync(`${user.id}`, accessToken)
        const bodyResponse = { accessToken, user: userDTO(user) }
        response.status(200).json(bodyResponse)
    } catch (error) {
        handleError(error, response)
    }
  }

export async function loginAsync(request: Request, response: Response, next: NextFunction) {

    try {
        if (!isValidEmail(request.body.email)) { return response.status(404).json(new ErrorPayload(400, 'Invalid email')) }
        const users =  await UserInterface.findAsync({ email : request.body.email })

        if (!users || users.length === 0) { return response.status(404).json(new ErrorPayload(404, 'User not found')) }
        const user = users[0]
        if (user.password !== request.body.password) { return response.status(401).json(new ErrorPayload(403, 'Wrong password')) }

        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function logoutAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const logged = response.locals.loggedUser as User
        const user = response.locals.user as User
        if (logged && user && logged.id && user.id && logged.id.toString() === user.id.toString()) {
            const authHeader = request.header('authorization') || ''
            const token = authHeader.split(' ')[0]
            redisCache.deleteAccessTokenAsync(token)
            response.status(200)
            response.send()
        } else {
            response.status(401).json(new ErrorPayload(401, 'Unauthorized'))
        }
    } catch (error) {
        handleError(error, response)
    }
}

export async function loadLoggedUser(request: Request, response: Response, next: NextFunction) {
    const token = extractAuthBearerToken(request)
    try {
        if (!token) { return next() }

        const id: string = await redisCache.getUserIdAsync(token)

        if (!id) {
            logger.error(`USER Ctrl => Invalid bearer token: ${token}`)
            throw new ErrorPayload(400, `Invalid bearer token: ${token}`)
        }

        const loggedUser = await UserInterface.getAsync(id)
        if (!loggedUser) {
            logger.error(`USER Ctrl => User not found with id: ${id}`)
            return response.status(403).json(new ErrorPayload(404, 'User not found'))
        }

        logger.info(`USER Ctrl => Loaded logged user ${loggedUser.email}`)
        response.locals.loggedUser = loggedUser

        next()
    } catch (error) {
        handleError(error, response)
    }
}

export function authenticate(request: Request, response: Response, next: NextFunction) {
    if (!response.locals.loggedUser) { response.status(401).json(new ErrorPayload(403, `Unauthorised. You need to provide a valid bearer token`)) }

    next()
}
function extractAuthBearerToken(request: Request): string {
    const authHeader = request.header('authorization') || ''
    const token = authHeader.split(' ')[1]
    return token
}

function handleError(error: ErrorPayload | Error, response: Response){
    logger.error(error)
    if (error instanceof ErrorPayload) {
        response.status(error.code).json(error)
    } else {
        response.status(500).json(new ErrorPayload(500, 'Something went wrong'))
    }
}
