import { mongodb } from '../services'
import { User, userDTO, UserAttributes } from './sequelize'
import { User as mUser } from './mongoDB'

export const seqModels = [ User ]

export function defineMongooseModels() {
    mUser.define(mongodb.client)
}

export { User, userDTO, UserAttributes, mUser }
