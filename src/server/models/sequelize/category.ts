import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, CreatedAt, UpdatedAt, BelongsToMany } from 'sequelize-typescript'
import { Offer } from './offer'
import { OfferCategory } from './offerCategory'
import { ErrorPayload } from '../../errorPayload'
import * as uuid from 'uuid'

interface IAttributes {
    name: string
    deleted: boolean
}

interface IUpdateAttributes {
    deleted: boolean
}

@Table({ tableName: 'Category' })
class Category extends Model<Category> {

    public static async getAsync(id: string): Promise<Category | null> {
        return this.findByPk<Category>(id)
    }

    public static async getManyAsync(where: any): Promise<Category[] | null> {
        return this.findAll<Category>({ where })
    }

    public static async getOneAsync(where: any): Promise<Category | null> {
        return this.findOne<Category>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Category> {
        const category: Category = await Category.create(params)
        return category.save()
    }

    public static async updateAsync(idToUpdate: string, params: IUpdateAttributes): Promise<Category | null> {
        const categoryToUpdate: Category | null = await this.getAsync(idToUpdate)
        if (categoryToUpdate) {
            return categoryToUpdate.update(params)
        }
        throw (new ErrorPayload(404, 'Category not found'))
    }

    public static toDTO(category: Category) {
        return {
            id: category.id,
            //offers: category.offers ? category.offers.map((offer) => Offer.toDTO(offer)) : [],
            name: category.name,
            deleted: category.deleted,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    /*@BelongsToMany(() => Offer, () => OfferCategory)
    public offers*/

    @AllowNull(false)
    @Column(DataType.TEXT)
    public name

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    public deleted

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt
}

export { IAttributes, IUpdateAttributes, Category }
