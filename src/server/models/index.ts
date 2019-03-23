import { User, UserAttributes, UserUpateAttributes, } from './sequelize'
import { Offer, OfferAttributes, } from './sequelize'

export const seqModels = [ User, Offer ]

export { User, UserAttributes, UserUpateAttributes }
export { Offer, OfferAttributes }
