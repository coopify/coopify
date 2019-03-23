import { compare, genSalt, hash } from 'bcrypt-nodejs'
import { NextFunction, Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import * as moment from 'moment'
import { UserInterface } from '../interfaces'
import { logger, redisCache, facebook, googleAuth, sendgrid, blockchain } from '../services'
import { User } from '../models'
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

export async function getFacebookAuthURLAsync(request: Request, response: Response) {
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
        const userDataRaw = await facebook.getUserDataAsync(tokens.access_token)
        const userData = facebook.transform(userDataRaw)
        const user = await UserInterface.createFromFBAsync(userData, tokens)
        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function signupAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const { email } = request.body
        if (!email) { throw new ErrorPayload(400, 'Missing required data') }
        if (!isValidEmail(request.body.email)) { throw new ErrorPayload(400, 'Invalid email') }
        const users = await UserInterface.findAsync({ email : request.body.email })

        if (users && users.length > 0) { return response.status(400).json(new ErrorPayload(400, 'Email already in use')) }

        const user =  await UserInterface.createAsync(request.body)
        if (!user) { return response.status(404).json(new ErrorPayload(404, 'Failed to create user')) }
        blockchain.signUp(user.id) //Call the blockchain to generate the wallet, etc.
        await sendgrid.sendEmail({
            from: 'coopify@dev.com',
            subject: 'Welcome to Coopify',
            text: 'Welcome',
            to: user.email,
            html: '<strong>We are glad to have you</strong>',
        })
        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function updateAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const loggedUser = response.locals.loggedUser
        if (!loggedUser) { throw new ErrorPayload(404, 'User not found') }
        const attributes = request.body.attributes
        if (!attributes) { throw new ErrorPayload(403, 'Missing required data') }
        const user = await UserInterface.updateAsync(response.locals.loggedUser, attributes)
        if (!user) { throw new ErrorPayload(403, 'Could not update user profile') }
        response.status(200).json({ user: User.toDTO(user) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function googleAPIURLAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const url = googleAuth.generateAuthURI()
        response.status(200).json({ url })
        response.send()
    } catch (error) {
        logger.error(error)
        response.status(400).json(new ErrorPayload(400, error, error))
    }
}

export async function getBalanceAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const balance = await blockchain.getBalanceAsync(response.locals.user.id)
        response.status(200).json(balance)
        response.send()
    } catch (error) {
        logger.error(error)
        response.status(400).json(new ErrorPayload(400, error, error))
    }
}

export async function getTransactionsAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const transactions = await blockchain.getTransactionsAsync(response.locals.user.id)
        const userTransactions = transactions.filter((t) => t.from !== 'Coopify' && t.to !== 'Coopify' )
        const coopifyTransactions = transactions.filter((t) => t.from === 'Coopify' || t.to === 'Coopify' )
        if (userTransactions) {
            const usersIds = userTransactions.map((t) => t.from !== response.locals.user.id ? t.from : t.to)
            const users = await UserInterface.findAsync({ id: { $in: usersIds } })
            if (!users) { throw new ErrorPayload(500, 'No users found') }
            userTransactions.map((t) => {
                const user = users.find((u) => u === response.locals.user.id !== t.from ? t.from : t.to)
                if (!user) { throw new ErrorPayload(404, 'User not found') }
                if (t.from === response.locals.user.id) {
                    t.from = response.locals.user.name 
                    t.to = user.name
                } else {
                    t.from = response.locals.user.name 
                    t.to = user.name
                }
            })
        }
        if (coopifyTransactions) {
            coopifyTransactions.map((t) => {
                if (t.from === response.locals.user.id) {
                    t.from = response.locals.user.name 
                    t.to = 'Coopify'
                } else {
                    t.from = 'Coopify'
                    t.to = response.locals.user.name 
                }
            })
        }
        response.status(200).json(coopifyTransactions.concat(userTransactions))
        response.send()
    } catch (error) {
        logger.error(error)
        response.status(400).json(new ErrorPayload(400, error, error))
    }
}

export async function googleAPIExchangeCodeForTokenAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const code = request.body.code
        const result = await googleAuth.ExchangeCodeForToken(code)
        const googleData = await googleAuth.getUserData(result.access_token, result.refresh_token)
        const user = await UserInterface.createFromGoogleAsync(googleData, result)
        if (user == null) { throw new ErrorPayload(400, 'Could not create user from IP') }
        response.locals.user = user
        next()

    } catch (error) {
        logger.error(error)
        response.status(400).json(new ErrorPayload(400, error, error))
    }
}

export async function generateTokenAsync(request: Request, response: Response, next: NextFunction) {
    const user: User = response.locals.user
    const payload = { userId: user.id }

    try {
        const accessToken = sign(payload, 'someKeyToSubstitute')
        await redisCache.saveAccessTokenAsync(`${user.id}`, accessToken)
        const bodyResponse = { accessToken, user: User.toDTO(user) }
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

export async function facebookLoginAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const { facebookId } = request.body
        if (!facebookId) { throw new ErrorPayload(400, 'Missing required data')  }
        const user = await UserInterface.findOneAsync({ FBId: facebookId })
        if (!user) { throw new ErrorPayload(404, 'User with that facebook id was not found') }
        response.locals.user = user
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function googleLoginAsync(request: Request, response: Response, next: NextFunction) {
    try {
        const { googleId } = request.body
        if (!googleId) { throw new ErrorPayload(400, 'Missing required data')  }
        const user = await UserInterface.findOneAsync({ googleId })
        if (!user) { throw new ErrorPayload(404, 'User with that google id was not found') }
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
    logger.info(JSON.stringify(request.body));
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
    try {
        if (!response.locals.loggedUser) { throw new ErrorPayload(403, `Unauthorised. You need to provide a valid bearer token`) }    
    } catch (error) {
        handleError(error, response)
    }
    next()
}

export function validateOwner(request: Request, response: Response, next: NextFunction) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const routeUser: User = response.locals.user
        if (loggedUser.id !== routeUser.id) { throw new ErrorPayload(403, `Unauthorised. You don't have ownership of the selected resource`) }    
        next()
    } catch (error) {
        handleError(error, response)
    }
}

function extractAuthBearerToken(request: Request): string {
    const authHeader = request.header('authorization') || ''
    const token = authHeader.split(' ')[1]
    return token
}

function handleError(error: ErrorPayload | Error, response: Response){
    logger.error(error + ' - ' + JSON.stringify(error))
    if (error instanceof ErrorPayload) {
        response.status(error.code).json(error)
    } else {
        response.status(500).json(new ErrorPayload(500, 'Something went wrong', error))
    }
}
