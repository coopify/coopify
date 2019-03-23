import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, AfterCreate, ForeignKey } from 'sequelize-typescript'
import { rdb } from '../../services'
import { Offer } from './offer';

interface IAttributes {
    offerId: string
    selected: boolean
    frequency: 'Hour' | 'Session ' | 'FinalProduct'
    price: number
}

@Table({ timestamps: true })
class Offer_Price extends Model<Offer_Price> {

    public static async getAsync(id: string): Promise<Offer_Price | null> {
        return this.findById<Offer_Price>(id)
    }

    public static async getManyAsync(where: any): Promise<Offer_Price[] | null> {
        return this.findAll<Offer_Price>({ where })
    }

    public static async getOneAsync(where: any): Promise<Offer_Price | null> {
        return this.findOne<Offer_Price>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Offer_Price> {
        const offerPrice: Offer_Price = await new Offer_Price(params)
        return offerPrice.save()
    }

    public static toDTO(offerPrice: Offer_Price) {
        return {
            id: offerPrice.id,
            offerId: offerPrice.offerId,
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

export { IAttributes, Offer_Price }