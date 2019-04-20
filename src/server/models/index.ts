import { User, UserAttributes, UserUpateAttributes, Offer, OfferAttributes, Category, CategoryAttributes, CategoryUpdateAttributes, OfferCategory, OfferCategoryAttributes, IServiceFilter } from './sequelize'

export const seqModels = [User, Offer, Category, OfferCategory]

export { User, UserAttributes, UserUpateAttributes, OfferAttributes, Offer, Category, CategoryAttributes, CategoryUpdateAttributes, OfferCategory, OfferCategoryAttributes, IServiceFilter }
