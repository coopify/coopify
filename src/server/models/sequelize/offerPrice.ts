import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey } from 'sequelize-typescript'
import { Offer } from './offer'

interface IAttributes {
    offerId: string
    selected: boolean
    frequency: 'Hour' | 'Session ' | 'FinalProduct'
    price: number
}

@Table({ timestamps: true })
class OfferPrice extends Model<OfferPrice> {

    public static async getAsync(id: string): Promise<OfferPrice | null> {
        return this.findById<OfferPrice>(id)
    }

    public static async getManyAsync(where: any): Promise<OfferPrice[] | null> {
        return this.findAll<OfferPrice>({ where })
    }

    public static async getOneAsync(where: any): Promise<OfferPrice | null> {
        return this.findOne<OfferPrice>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<OfferPrice> {
        const offerPrice: OfferPrice = await new OfferPrice(params)
        return offerPrice.save()
    }

    public static toDTO(offerPrice: OfferPrice) {
        return {
            id: offerPrice.id,
            selected: offerPrice.selected,
            frequency: offerPrice.frequency,
            price: offerPrice.price,
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

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    public selected

    @AllowNull(false)
    @Column(DataType.STRING)
    public frequency

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public price
}

export { IAttributes, OfferPrice }
