import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './user'
import { OfferPrice, IAttributes as OfferPriceAttributes } from './offerPrice'

interface IAttributes {
    userId: string
    title?: string
    description?: Text
    images: Array<{ url: string, default: boolean }>
    category?: string
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
    exchangeInstances?: string[]
    lowerPrice?: number
    upperPrice?: number
}

@Table({ timestamps: true })
class Offer extends Model<Offer> {

    public static async getAsync(id: string): Promise<Offer | null> {
        return this.findById<Offer>(id, {
            include: [
                { model: OfferPrice },
                { model: User },
            ],
        })
    }

    public static async getManyAsync(filter: IServiceFilter, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
        const where = this.transformFilter(filter)
        return this.findAndCount<Offer>({
            where: where.offer, include: [
                { model: OfferPrice , where: where.offerPrice },
                { model: User },
            ],
            limit,
            offset: skip,
        })
    }

    public static async getOneAsync(filter: IServiceFilter): Promise<Offer | null> {
        const where = this.transformFilter(filter)
        return this.findOne<Offer>({
            where, include: [{
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
            category: offer.category,
            paymentMethod: offer.paymentMethod,
            startDate: offer.startDate,
            finishDate: offer.finishDate,
            status: offer.status,
            prices: offer.prices ? offer.prices.map((price) => OfferPrice.toDTO(price)) : [],
            by: offer.by.email, //TODO: Change this to name
        }
    }

    private static transformFilter(filter: IServiceFilter): { offer?: any, offerPrice?: any } {
        const where: { offer?: any, offerPrice?: any } = { offer: {}, offerPrice: {} }
        if (filter.name) { where.offer.title = { $like: filter.name } }
        if (filter.paymentMethods) { where.offer.paymentMethod = { $in: filter.paymentMethods } }
        if (filter.lowerPrice) { where.offerPrice.price = { $lt: filter.lowerPrice } }
        if (filter.upperPrice) { where.offerPrice.price = { $gt: filter.upperPrice } }
        if (filter.lowerPrice && filter.upperPrice) { where.offerPrice.price = { $gt: filter.upperPrice, $lt: filter.lowerPrice } }
        if (filter.exchangeInstances) { where.offerPrice.frequency = { $in: filter.exchangeInstances } }

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

    @Column(DataType.TEXT)
    public category

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
