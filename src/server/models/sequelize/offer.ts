import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey } from 'sequelize-typescript'
import { User } from './user'
import { OfferPrice, IAttributes as OfferPriceAttributes } from './offerPrice'

interface IAttributes {
    userId: string
    title?: Text
    description?: Text
    images: Array<{ url: string, default: boolean }>
    category?: string
    paymentMethod: 'Coopy' | 'Exchange'
    startDate: Date
    finishDate?: Date
    status: 'Started' | 'Paused'
    prices?: Array<OfferPriceAttributes>
}

@Table({ timestamps: true })
class Offer extends Model<Offer> {

    public static async getAsync(id: string): Promise<Offer | null> {
        return this.findById<Offer>(id, {
            include: [{
                model: OfferPrice,
            }],
        })
    }

    public static async getManyAsync(where: any): Promise<Offer[] | null> {
        return this.findAll<Offer>({ 
            where , include: [{
                model: OfferPrice
            }],
        })
    }

    public static async getOneAsync(where: any): Promise<Offer | null> {
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
        }
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
}

export { IAttributes, Offer }