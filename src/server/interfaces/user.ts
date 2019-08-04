import { User, UserAttributes, UserUpateAttributes } from '../models'
import { validateBirthdate, validateGender, handleError } from './helpers'
import { IUserData as GoogleUserData } from '../services/googleAuthentication'
import { IUserData as FBUserData } from '../services/facebook'
import * as randomString from 'random-string'
import { ErrorPayload } from '../errorPayload'

export async function getAsync(id: string): Promise<User> {
    try {
        const userInstance = await User.getAsync(id)
        if (!userInstance) { throw new ErrorPayload(404, 'User not found') }

        return userInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: object): Promise<User[]> {
    try {
        const userInstances = await User.getManyAsync(where)
        if (!userInstances) { throw new ErrorPayload(500, 'Failed to get users') }

        return userInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: object): Promise<User | null> {
    try {
        const userInstance = await User.getOneAsync(where)
        //if (!userInstance) { throw new ErrorPayload(404, 'User not found') }

        return userInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: UserAttributes): Promise<User> {
    try {
        if (body.gender) { validateGender(body.gender) }
        if (body.birthdate) { validateBirthdate(body.birthdate) }
        body.referalCode = randomString(8)
        const userInstance = await User.createAsync(body)
        if (!userInstance) { throw new ErrorPayload(500, 'Failed to create user') }

        return userInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createFromFBAsync(body: FBUserData, tokens: { access_token: string, refresh_token: string } ): Promise<User> {
    try {
        // if (body.gender) { validateGender(body.gender) }
        const user = await findOneAsync({ email: body.email })
        if (user) { throw new ErrorPayload(400, 'This email is already in use, please sync your account') }
        const payload = { ...body, FBAccessToken: tokens.access_token, FBRefreshToken: tokens.refresh_token, referalCode: randomString(8) }

        const userInstance = await User.createAsync(payload)
        if (!userInstance) { throw new ErrorPayload(500, 'Failed to create user from FB') }

        return userInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createFromGoogleAsync(body: GoogleUserData, tokens: { access_token: string, refresh_token: string }): Promise<User> {
    try {
        const params = { ...body, googleAccessToken: tokens.access_token, googleRefreshToken: tokens.refresh_token, isVerified: true, referalCode: randomString(8) }
        const user = await findOneAsync({ email: body.email })
        if (user) { throw new ErrorPayload(400, 'This email is already in use, please sync your account') }
        const userInstance = await User.createAsync(params)
        if (!userInstance) { throw new ErrorPayload(500, 'Failed to create user from Google') }

        return userInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function updateAsync(user: User, body: UserUpateAttributes, transaction?): Promise<User> {
    try {
        if (body.gender) { validateGender(body.gender) }
        if (body.birthdate) { validateBirthdate(body.birthdate) }
        const userInstance = await User.updateAsync(user, body, transaction)
        if (!userInstance) { throw new ErrorPayload(500, 'Failed to update user') }
        return userInstance
    } catch (error) {
        throw handleError(error)
    }
}
