import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { Offer } from './offer'
import { Category } from './category'

interface IAttributes {
    offerId: string
    categoryId: string
}

@Table({ tableName: 'OfferCategory' })
class OfferCategory extends Model<OfferCategory> {

    public static async getAsync(id: string): Promise<OfferCategory | null> {
        return this.findByPk<OfferCategory>(id)
    }

    public static async getManyAsync(where: any): Promise<OfferCategory[] | null> {
        return this.findAll<OfferCategory>({ where })
    }

    public static async getOneAsync(where: any): Promise<OfferCategory | null> {
        return this.findOne<OfferCategory>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<OfferCategory> {
        const offerCategory: OfferCategory = await OfferCategory.create(params)
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

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt
}

export { IAttributes, OfferCategory }
