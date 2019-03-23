import { User, UserAttributes, UserUpateAttributes } from '../models'
import { logger } from '../services'
import { validateBirthdate, validateGender } from './helpers'
import { IUserData as GoogleUserData } from '../services/googleAuthentication'
import { IUserData as FBUserData } from '../services/facebook'

export async function getAsync(id: string): Promise<User | null> {
    try {
        const userInstance = await User.getAsync(id)

        return userInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: object): Promise<User[] | null> {
    try {
        const userInstances = await User.getManyAsync(where)

        return userInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findOneAsync(where: object): Promise<User | null> {
    try {
        const userInstances = await User.getOneAsync(where)

        return userInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: UserAttributes): Promise<User | null> {
    try {
        //See if it corresponds
        if (body.gender) { validateGender(body.gender) }
        if (body.birthdate) { validateBirthdate(body.birthdate) }
        const userInstance = await User.createAsync(body)

        return userInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createFromFBAsync(body: FBUserData, tokens: { access_token: string, refresh_token: string } ): Promise<User | null> {
    try {
        if (body.gender) { validateGender(body.gender) }
        const payload = { ...body, password: 'default', FBAccessToken: tokens.access_token, FBRefreshToken: tokens.refresh_token }
        logger.info(`payload => ${JSON.stringify(payload)}`)
        const userInstance = await User.createAsync(payload)

        return userInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createFromGoogleAsync(body: GoogleUserData, tokens: { access_token: string, refresh_token: string }): Promise<User | null> {
    try {
        const params = { ...body, password: 'default', googleAccessToken: tokens.access_token, googleRefreshToken: tokens.refresh_token, isVerified: true }
        const userInstance = await User.createAsync(params)

        return userInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function updateAsync(user: User, body: UserUpateAttributes): Promise<User | null> {
    try {
        if (body.gender) { validateGender(body.gender) }
        if (body.birthdate) { validateBirthdate(body.birthdate) } //TODO: validate 18 or older?
        //validateInterests(body.interests) //TODO: validate dynamically against a table or similar
        const userInstance = await User.updateAsync(user, body)
        return userInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
