import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey, BelongsTo, BelongsToMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { User } from './user'
import { OfferCategory } from './offerCategory'
import { Category } from './category'
import { Proposal } from '..'
import { Transaction, Op, OrderItem } from 'sequelize'

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
    shared?: boolean
}

interface IUpdateAttributes {
    title?: string
    description?: Text
    images?: Array<{ url: string, default: boolean }>
    finishDate?: Date
    status?: 'Started' | 'Paused'
    shared?: boolean
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

@Table({ tableName: 'Offer' })
class Offer extends Model<Offer> {

    public static async getAsync(id: string): Promise<Offer | null> {
        return this.findByPk<Offer>(id, {
            include: [
                { model: User },
                { model: Category },
            ],
        })
    }

    public static async getFilteredAsync(filter: IServiceFilter, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
        const seqFilter = this.transformFilter(filter)
        return this.findAndCountAll<Offer>({
            where: seqFilter.offer, include: [
                { model: User },
                { model: Category, where: seqFilter.categories, required: seqFilter.categories ? true : false },
            ],
            limit,
            offset: skip,
            order: seqFilter.order ? [seqFilter.order] : seqFilter.order,
        })
    }

    public static async getManyAsync(where: any, limit?: number, skip?: number): Promise<{ rows: Offer[], count: number } | null> {
        return this.findAndCountAll<Offer>({
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
        const offer: Offer = await Offer.create(params)
        return offer.save()
    }

    public static async updateAsync(offer: Offer, params: IUpdateAttributes, seqTransaction?: Transaction): Promise<Offer> {
        const updatedOffer = await offer.update(params)
        if (seqTransaction) {
            return updatedOffer.save({ transaction: seqTransaction })
        } else {
            return updatedOffer.save()
        }
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
            ratingCount: offer.rateCount,
            ratingSum: offer.rateSum,
            rating: parseFloat((offer.rateSum / (offer.rateCount > 0 ? offer.rateCount : 1)).toFixed(2)),
        }
    }
    //tslint:disable:array-type
    private static transformFilter(filter: IServiceFilter): { offer?: any, categories?: any, order?: OrderItem } {
        const where: { offer?: any, categories?: any, order?: OrderItem } = { offer: { [Op.or]: new Array() }, categories: {} }
        //tslint:enable:array-type
        if (filter.name) { where.offer[Op.or] = where.offer[Op.or].concat([ { title: { [Op.iLike]: `%${filter.name}%` } }, { description: { [Op.iLike]: `%${filter.name}%` } } ]) }
        if (filter.paymentMethods) { where.offer.paymentMethod = { [Op.in]: filter.paymentMethods } }
        const hourSelected = filter.exchangeMethods ? filter.exchangeMethods.findIndex((s) => s === 'Hour') >= 0 : false
        const sessionSelected = filter.exchangeMethods ? filter.exchangeMethods.findIndex((s) => s === 'Session') >= 0 : false
        const finalProductSelected = filter.exchangeMethods ? filter.exchangeMethods.findIndex((s) => s === 'FinalProduct') >= 0 : false
        const isOnlyExchange = filter.paymentMethods && filter.paymentMethods.findIndex((p) => p === 'Exchange') >= 0 && filter.paymentMethods.length === 1
        const isOnlyCoopy = filter.paymentMethods && filter.paymentMethods.findIndex((p) => p === 'Coopy') >= 0 && filter.paymentMethods.length === 1
        const isCoopyAndExchange = filter.paymentMethods && filter.paymentMethods.length === 2
        if (filter.lowerPrice && filter.upperPrice && (isCoopyAndExchange || isOnlyCoopy)) {
            if (hourSelected) { this.getSelectedPaymentInstanceParams(where, filter, 'hourPrice', isCoopyAndExchange ? isCoopyAndExchange : false) }
            if (sessionSelected) { this.getSelectedPaymentInstanceParams(where, filter, 'sessionPrice', isCoopyAndExchange ? isCoopyAndExchange : false) }
            if (finalProductSelected) { this.getSelectedPaymentInstanceParams(where, filter, 'finalProductPrice', isCoopyAndExchange ? isCoopyAndExchange : false) }
            if (hourSelected && sessionSelected && finalProductSelected) {
                if (!isOnlyExchange) {
                    where.offer[Op.or] = where.offer[Op.or].concat([
                        this.getUnselectedPaymentInstanceParam(filter, 'hourPrice'),
                        this.getUnselectedPaymentInstanceParam(filter, 'sessionPrice'),
                        this.getUnselectedPaymentInstanceParam(filter, 'finalProductPrice'),
                    ])
                } else {
                    this.getDefaultPaymentPriceParam(where, filter.upperPrice, filter.lowerPrice)
                }
            }
        } else {
            if (filter.lowerPrice && (isCoopyAndExchange || isOnlyCoopy)) {
                if (hourSelected) { where.offer.hourPrice = { [Op.lte]: filter.lowerPrice } }
                if (sessionSelected) { where.offer.sessionPrice = { [Op.lte]: filter.lowerPrice } }
                if (finalProductSelected) { where.offer.finalProductPrice = { [Op.lte]: filter.lowerPrice } }
                if (hourSelected  && sessionSelected  && finalProductSelected ) {
                    this.getDefaultPaymentPriceParam(where, filter.upperPrice, filter.lowerPrice)
                }
            }
            if (filter.upperPrice && (isCoopyAndExchange || isOnlyCoopy)) {
                if (hourSelected) { where.offer.hourPrice = { [Op.lte]: filter.upperPrice } }
                if (sessionSelected) { where.offer.sessionPrice = { [Op.lte]: filter.upperPrice } }
                if (finalProductSelected) { where.offer.finalProductPrice = { [Op.lte]: filter.upperPrice } }
                if (hourSelected  && sessionSelected  && finalProductSelected ) {
                    this.getDefaultPaymentPriceParam(where, filter.upperPrice, filter.lowerPrice)
                }
            }
        }
        if (filter.categories) { where.categories.name = filter.categories } else { delete where.categories }
        switch (filter.orderBy) {
            case 'price':
                where.order = ['hourPrice', 'DESC']
                break
            case 'rate':
                where.order = ['rateCount', 'DESC']
                break
            default:
                where.order = ['createdAt', 'DESC']
                break
        }
        if (where.offer && where.offer[Op.or].length === 0) { delete where.offer[Op.or] }
        return where
    }

    private static getSelectedPaymentInstanceParams(where: any, filter: any, propName: string, isCoopyAndExchange: boolean) {
        if (isCoopyAndExchange) {
            where.offer[Op.or] = where.offer[Op.or].concat([
                {
                    [Op.or] : {
                        [propName]: { [Op.lte]: filter.upperPrice, [Op.gte]: filter.lowerPrice },
                        paymentMethod: { [Op.in]: ['Exchange'] },
                    },
                },
            ])
        } else {
            where.offer[Op.or] = where.offer[Op.or].concat([
                { [propName]: { [Op.lte]: filter.upperPrice, [Op.gte]: filter.lowerPrice } },
            ])
        }
    }

    private static getUnselectedPaymentInstanceParam(filter: any, propName: string) {
        return { [Op.or]:
            [
                { paymentMethod: { [Op.in]: ['Coopy'] }, [propName]: { [Op.lte]: filter.upperPrice, [Op.gte]: filter.lowerPrice } },
                { paymentMethod: { [Op.in]: ['Exchange'] } },
            ],
        }
    }

    private static getDefaultPaymentPriceParam(where: any, upperPrice?: number, lowerPrice?: number) {
        let hourPrice, sessionPrice, finalProductPrice
        if (upperPrice) {
            hourPrice[Op.lte] = upperPrice
            sessionPrice[Op.lte] = upperPrice
            finalProductPrice[Op.lte] = upperPrice
        }
        if (lowerPrice) {
            hourPrice[Op.gte] = lowerPrice
            sessionPrice[Op.gte] = lowerPrice
            finalProductPrice[Op.gte] = lowerPrice
        }
        where.offer[Op.or] = where.offer[Op.or].concat([
            hourPrice,
            sessionPrice,
            finalProductPrice,
        ])
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

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public shared

    @Column(DataType.STRING)
    public status

    @Default(0)
    @Column(DataType.INTEGER)
    public rateCount

    @Default(0)
    @Column(DataType.INTEGER)
    public rateSum

    /*@Column({
        type: DataType.VIRTUAL,
        get: function(): number {
            const rateCount = (this.getDataValue('rateCount') as any)
            const rateSum = this.get('rateSum')
            return parseFloat((rateSum / (rateCount > 0 ? rateCount : 1)).toFixed(2))
        },
    })
    public rating*/

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt

    @BelongsTo(() => User)
    public by

    @HasMany(() => Proposal)
    public proposalsForThisService

    @HasMany(() => Proposal)
    public proposalsUsingThisService
}

export { IAttributes, Offer, IServiceFilter, IUpdateAttributes }
