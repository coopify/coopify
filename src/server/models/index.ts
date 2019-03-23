import { User, UserAttributes, UserUpateAttributes,   } from './sequelize'
import { Bid, BidAttributes,   } from './sequelize'

export const seqModels = [ User, Bid ]

export { User, UserAttributes, UserUpateAttributes }
export { Bid, BidAttributes }
