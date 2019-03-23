import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, AfterCreate, ForeignKey } from 'sequelize-typescript'
import { rdb } from '../../services'
import { User } from '.';

interface IAttributes {
    //bidId: uuid
    //userId: User.id
    description?: Text
    image: [string]
    category?: string
    paymentMethod: string
    startDate: Date
    finishDate: Date
    status: 'Started' | 'Paused' | string
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
            image: bid.image,
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

    //@ForeignKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public userId

    @Column(DataType.TEXT)
    public description

    //ver ma;ana
    @Column(DataType.JSONB)
    public image

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