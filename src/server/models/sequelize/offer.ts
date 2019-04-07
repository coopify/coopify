import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript'
import { User } from './user'
import { OfferPrice, IAttributes as OfferPriceAttributes } from './offerPrice'
import { OfferCategory } from './offerCategory'
import { Category } from './category'

interface IAttributes {
    userId: string
    title?: string
    description?: Text
    images: Array<{ url: string, default: boolean }>
    categories?: string[]
    paymentMethod: 'Coopy' | 'Exchange'
    startDate: Date
    finishDate?: Date
    status: 'Started' | 'Paused'
    //tslint:disable:array-type
    prices?: Array<OfferPriceAttributes>
}

interface IServiceFilter {
    name?: string,
    paymentMethods?: string[]
    exchangeMethods?: string[]
    lowerPrice?: number
    upperPrice?: number
    orderBy?: string
}

@Table({ timestamps: true })
class Offer extends Model<Offer> {

    public static async getAsync(id: string): Promise<Offer | null> {
        return this.findById<Offer>(id, {
            include: [
                { model: OfferPrice },
                { model: User },
                { model: Category },
            ],
        })
    }

    public static async getManyAsync(filter: IServiceFilter, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
        const seqFilter = this.transformFilter(filter)
        return this.findAndCount<Offer>({
            where: seqFilter.offer, include: [
                { model: OfferPrice , where: seqFilter.offerPrice, required: false },
                { model: User },
                { model: Category },
            ],
            limit,
            offset: skip,
            order: seqFilter.order,
        })
    }

    public static async getOneAsync(filter: IServiceFilter): Promise<Offer | null> {
        const seqFilter = this.transformFilter(filter)
        return this.findOne<Offer>({
            where: seqFilter.offer, include: [{
                model: OfferPrice,
            }],
        })
    }

    public static async createAsync(params: IAttributes): Promise<Offer> {
        const offer: Offer = await new Offer(params)
        return offer.save()
    }

    public static toDTO(offer: Offer) {
        return {
            id: offer.id,
            title: offer.title,
            userId: offer.userId,
            description: offer.description,
            images: offer.images,
            categories: offer.categories ? offer.categories.map((category) => Category.toDTO(category)) : [],
            paymentMethod: offer.paymentMethod,
            startDate: offer.startDate,
            finishDate: offer.finishDate,
            status: offer.status,
            prices: offer.prices ? offer.prices.map((price) => OfferPrice.toDTO(price)) : [],
            by: offer.by.email, //TODO: Change this to name
        }
    }

    private static transformFilter(filter: IServiceFilter): { offer?: any, offerPrice?: any, order: Array<Array<string>> } {
        const where: { offer?: any, offerPrice?: any, order: Array<Array<string>> } = { offer: {}, offerPrice: {}, order: new Array() }
        if (filter.name) { where.offer.title = { $like: filter.name } }
        if (filter.paymentMethods) { where.offer.paymentMethod = { $or: filter.paymentMethods } }
        if (filter.lowerPrice) { where.offerPrice.price = { $gt: filter.lowerPrice } }
        if (filter.upperPrice) { where.offerPrice.price = { $lt: filter.upperPrice } }
        if (filter.lowerPrice && filter.upperPrice) { where.offerPrice.price = { $lt: filter.upperPrice, $gt: filter.lowerPrice } }
        if (filter.exchangeMethods) { where.offerPrice.frequency = { $or: filter.exchangeMethods } }
        switch (filter.orderBy) {
            //orderBy === 'price' || orderBy === 'rate' || orderBy === 'date'
            case 'price':
                where.order = where.order.concat([['prices', 'DESC']])
                break
            case 'rating':
                where.order = where.order.concat([['rating', 'DESC']])
                break
            default:
                where.order = where.order.concat([['createdAt', 'DESC']])
                break
        }

        if (!where.offerPrice.price && !where.offerPrice.frequency) { delete where.offerPrice }

        return where
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @ForeignKey(() => User )
    @AllowNull(false)
    @Column(DataType.UUID)
    public userId

    @Column(DataType.TEXT)
    public title

    @Column(DataType.TEXT)
    public description

    @AllowNull(false)
    @Column(DataType.JSONB)
    public images

    @BelongsToMany(() => Category, () => OfferCategory)
    public categories

    @AllowNull(false)
    @Column(DataType.STRING)
    public paymentMethod

    @AllowNull(false)
    @Column(DataType.DATE)
    public startDate

    @AllowNull(true)
    @Column(DataType.DATE)
    public finishDate

    @Column(DataType.STRING)
    public status

    @HasMany(() => OfferPrice)
    public prices

    @BelongsTo(() => User)
    public by
}

export { IAttributes, Offer, IServiceFilter }
