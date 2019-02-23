import { User } from '../../../src/server/models'
import { factory } from '../factory'
import { sign } from 'jsonwebtoken'
import { redisCache, logger } from '../../../src/server/services'

export async function logInUser(user: User | undefined) {
    const loggedInUser: User = user ? user : await factory.create('user')
    const accessToken = sign({ userId: loggedInUser.id }, 'someKeyToSubstitute')
    await redisCache.saveAccessTokenAsync(loggedInUser.id + '', accessToken)
    logger.info(`Logged in User ${loggedInUser.id}`)
    return {
        loggedInUser, accessToken,
    }
}
