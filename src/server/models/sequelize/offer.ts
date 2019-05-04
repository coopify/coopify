import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript'
import { User } from './user'
import { OfferCategory } from './offerCategory'
import { Category } from './category'
import { Proposal } from '..'

interface IAttributes {
    userId: string
    title?: string
    description?: Text
    images: Array<{ url: string, default: boolean }>
    categories?: string[]
    paymentMethod: 'Coopy' | 'Exchange'
    exchangeInstances: string[]
    startDate: Date
    finishDate?: Date
    hourPrice?: number
    sessionPrice?: number
    finalProductPrice?: number
    status: 'Started' | 'Paused'
}

interface IServiceFilter {
    name?: string,
    paymentMethods?: string[]
    exchangeMethods?: string[]
    lowerPrice?: number
    upperPrice?: number
    orderBy?: string
    categories?: string[]
}

@Table({ timestamps: true })
class Offer extends Model<Offer> {

    public static async getAsync(id: string): Promise<Offer | null> {
        return this.findById<Offer>(id, {
            include: [
                { model: User },
                { model: Category },
            ],
        })
    }

    public static async getFilteredAsync(filter: IServiceFilter, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
        const seqFilter = this.transformFilter(filter)
        return this.findAndCount<Offer>({
            where: seqFilter.offer, include: [
                { model: User },
                { model: Category, where: seqFilter.categories, required: seqFilter.categories ? true : false },
            ],
            limit,
            offset: skip,
            order: seqFilter.order,
        })
    }

    public static async getManyAsync(where: any, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
        return this.findAndCount<Offer>({
            where, include: [
                { model: User },
                { model: Category },
            ],
            limit,
            offset: skip,
        })
    }

    public static async getOneAsync(filter: IServiceFilter): Promise<Offer | null> {
        const seqFilter = this.transformFilter(filter)
        return this.findOne<Offer>({ where: seqFilter.offer })
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
            by: offer.by ? offer.by.name : undefined,
            hourPrice: offer.hourPrice,
            sessionPrice: offer.sessionPrice,
            finalProductPrice: offer.finalProductPrice,
        }
    }
    //tslint:disable:array-type
    private static transformFilter(filter: IServiceFilter): { offer?: any, categories?: any, order: Array<Array<string>> } {
        const where: { offer?: any, categories?: any, order: Array<Array<string>> } = { offer: { $or: new Array() }, order: new Array(), categories: {} }
        //tslint:enable:array-type
        if (filter.name) { where.offer.$or = where.offer.$or.concat([ { title: { $ilike: `%${filter.name}%` } }, { description: { $ilike: `%${filter.name}%` } } ]) }
        if (filter.paymentMethods) { where.offer.paymentMethod = { $eq: filter.paymentMethods[0] } }
        let hourSelected, sessionSelected, finalProductSelected = -1
        if (filter.exchangeMethods) {
            hourSelected = filter.exchangeMethods.findIndex((s) => s === 'Hour')
            sessionSelected = filter.exchangeMethods.findIndex((s) => s === 'Session')
            finalProductSelected = filter.exchangeMethods.findIndex((s) => s === 'FinalProduct')
            //where.offer.exchangeInstances = { $in: filter.exchangeMethods }
        }
        if (filter.lowerPrice && filter.upperPrice) {
            if (hourSelected > -1) { where.offer.hourPrice = { $lt: filter.upperPrice, $gt: filter.lowerPrice } }
            if (sessionSelected > -1) { where.offer.sessionPrice = { $lt: filter.upperPrice, $gt: filter.lowerPrice } }
            if (finalProductSelected > -1) { where.offer.finalProductPrice = { $lt: filter.upperPrice, $gt: filter.lowerPrice } }
            if (hourSelected === -1 && sessionSelected === -1 && finalProductSelected === -1) {
                where.offer.$or = where.offer.$or.concat([
                    { hourPrice: { $lt: filter.upperPrice, $gt: filter.lowerPrice } },
                    { sessionPrice: { $lt: filter.upperPrice, $gt: filter.lowerPrice } },
                    { finalProductPrice: { $lt: filter.upperPrice, $gt: filter.lowerPrice },
                }])
            }
        } else {
            if (filter.lowerPrice) {
                if (hourSelected > -1) { where.offer.hourPrice = { $gt: filter.lowerPrice } }
                if (sessionSelected > -1) { where.offer.sessionPrice = { $gt: filter.lowerPrice } }
                if (finalProductSelected > -1) { where.offer.finalProductPrice = { $gt: filter.lowerPrice } }
                if (hourSelected === -1 && sessionSelected === -1 && finalProductSelected === -1) {
                    where.offer.$or = where.offer.$or.concat([{ hourPrice: { $gt: filter.lowerPrice } }, { sessionPrice: { $gt: filter.lowerPrice } }, { finalProductPrice: { $gt: filter.lowerPrice } }])
                }
            }
            if (filter.upperPrice) {
                if (hourSelected > -1) { where.offer.hourPrice = { $lt: filter.upperPrice } }
                if (sessionSelected > -1) { where.offer.sessionPrice = { $lt: filter.upperPrice } }
                if (finalProductSelected > -1) { where.offer.finalProductPrice = { $lt: filter.upperPrice } }
                if (hourSelected === -1 && sessionSelected === -1 && finalProductSelected === -1) {
                    where.offer.$or = where.offer.$or.concat([{ hourPrice: { $lt: filter.upperPrice } }, { sessionPrice: { $lt: filter.upperPrice } }, { finalProductPrice: { $lt: filter.upperPrice } }])
                }
            }
        }
        if (filter.categories) { where.categories.name = { $in: filter.categories } } else { delete where.categories }
        switch (filter.orderBy) {
            case 'price':
                where.order = where.order.concat([['hourPrice', 'DESC']])
                break
            /*case 'rating':
                where.order = where.order.concat([['rating', 'DESC']])
                break*/
            default:
                where.order = where.order.concat([['createdAt', 'DESC']])
                break
        }
        if (where.offer && where.offer.$or.length === 0) { delete where.offer.$or }
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

    @AllowNull(true)
    @Column(DataType.ARRAY(DataType.STRING))
    public exchangeInstances

    @AllowNull(true)
    @Column(DataType.INTEGER)
    public hourPrice

    @AllowNull(true)
    @Column(DataType.INTEGER)
    public sessionPrice

    @AllowNull(true)
    @Column(DataType.INTEGER)
    public finalProductPrice

    @Column(DataType.STRING)
    public status

    @BelongsTo(() => User)
    public by

    @HasMany(() => Proposal)
    public proposalsForThisService

    @HasMany(() => Proposal)
    public proposalsUsingThisService
}

export { IAttributes, Offer, IServiceFilter }
