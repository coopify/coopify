import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, AfterCreate, ForeignKey } from 'sequelize-typescript'
import { rdb } from '../../services'
import { User } from './user';

interface IAttributes {
    userId: string
    description?: Text
    images: Array<{ url: string, default: boolean }>
    category?: string
    paymentMethod: 'Coopy' | 'FinalProduct' | 'Exchange'
    startDate: Date
    finishDate?: Date
    status: 'Started' | 'Paused'
}

@Table({ timestamps: true })
class Offer extends Model<Offer> {

    public static async getAsync(id: string): Promise<Offer | null> {
        return this.findById<Offer>(id)
    }

    public static async getManyAsync(where: any): Promise<Offer[] | null> {
        return this.findAll<Offer>({ where })
    }

    public static async getOneAsync(where: any): Promise<Offer | null> {
        return this.findOne<Offer>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Offer> {
        const offer: Offer = await new Offer(params)
        return offer.save()
    }

    public static toDTO(offer: Offer) {
        return {            
            id: offer.id,
            userId: offer.userId,
            description: offer.description,
            images: offer.images,
            category: offer.category,
            paymentMethod: offer.paymentMethod,
            startDate: offer.startDate,
            finishDate: offer.finishDate,
            status: offer.status,
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
}

export { IAttributes, Offer }