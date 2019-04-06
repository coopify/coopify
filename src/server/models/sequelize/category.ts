import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript'
import { Offer } from './offer'
import { OfferCategory } from './offerCategory'

interface IAttributes {
    offers: string,
    name: string,
}

@Table({ timestamps: true })
class Category extends Model<Category> {

    public static async getAsync(id: string): Promise<Category | null> {
        return this.findById<Category>(id)
    }

    public static async getManyAsync(where: any): Promise<Category[] | null> {
        return this.findAll<Category>({
            where ,
        })
    }

    public static async getOneAsync(where: any): Promise<Category | null> {
        return this.findOne<Category>({
            where,
        })
    }

    public static async createAsync(params: IAttributes): Promise<Category> {
        const category: Category = await new Category(params)
        return category.save()
    }

    public static toDTO(category: Category) {
        return {
            id: category.id,
            offers: category.offers ? category.offers.map((offer) => Offer.toDTO(offer)) : [],
            name: category.name,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @BelongsToMany(() => Offer, () => OfferCategory)
    public offers

    @AllowNull(true)
    @Column(DataType.TEXT)
    public name
}

export { IAttributes, Category }
