import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, AfterCreate, ForeignKey } from 'sequelize-typescript'
import { rdb } from '../../services'
import { User } from './user';

interface IAttributes {
    userId: string
    description?: Text
    images: [{ url: string, default: boolean }]
    category?: string
    paymentMethod: 'Coopy' | 'FinalProduct' | 'Exchange'
    startDate: Date
    finishDate: Date
    status: 'Started' | 'Paused'
}

@Table({ timestamps: true })
class Bid extends Model<Bid> {

    public static async getAsync(id: string): Promise<Bid | null> {
        return this.findById<Bid>(id)
    }

    public static async getManyAsync(where: any): Promise<Bid[] | null> {
        return this.findAll<Bid>({ where })
    }

    public static async getOneAsync(where: any): Promise<Bid | null> {
        return this.findOne<Bid>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Bid> {
        const bid: Bid = await new Bid(params)
        return bid.save()
    }

    public static toDTO(bid: Bid) {
        return {            
            id: bid.id,
            userId: bid.userId,
            description: bid.description,
            images: bid.images,
            category: bid.category,
            paymentMethod: bid.paymentMethod,
            startDate: bid.startDate,
            finishDate: bid.finishDate,
            status: bid.status,
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

    @AllowNull(false)
    @Column(DataType.DATE)
    public finishDate

    @Column(DataType.STRING)
    public status
}

export { IAttributes, Bid }