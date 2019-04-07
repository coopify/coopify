import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey } from 'sequelize-typescript'
import { Offer } from './offer'
import { Category } from './category'

interface IAttributes {
    offerId: string
    categoryId: string
}

@Table({ timestamps: true })
class OfferCategory extends Model<OfferCategory> {

    public static async getAsync(id: string): Promise<OfferCategory | null> {
        return this.findById<OfferCategory>(id)
    }

    public static async getManyAsync(where: any): Promise<OfferCategory[] | null> {
        return this.findAll<OfferCategory>({ where })
    }

    public static async getOneAsync(where: any): Promise<OfferCategory | null> {
        return this.findOne<OfferCategory>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<OfferCategory> {
        const offerCategory: OfferCategory = await new OfferCategory(params)
        return offerCategory.save()
    }

    public static toDTO(offerCategory: OfferCategory) {
        return {
            id: offerCategory.id,
            offerId: offerCategory.offerId,
            categoryId: offerCategory.categoryId,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @ForeignKey(() => Offer)
    @AllowNull(false)
    @Column(DataType.UUID)
    public offerId

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column(DataType.UUID)
    public categoryId
}

export { IAttributes, OfferCategory }
