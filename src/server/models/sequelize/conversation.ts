import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey, HasMany, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { User } from './user'
import { Message } from './message'
import { Proposal } from './proposal'

interface IAttributes {
    fromId: string
    from?: User
    toId: string
    to?: User
}

@Table({ tableName: 'Conversation' })
class Conversation extends Model<Conversation> {

    public static async getAsync(id: string): Promise<Conversation | null> {
        return this.findByPk<Conversation>(id, {
            include: [
                { model: User, as: 'from' },
                { model: User, as: 'to' },
            ],
        })
    }

    public static async getManyAsync(where: any): Promise<Conversation[] | null> {
        return this.findAll<Conversation>({
            where,
            include: [
                { model: User, as: 'from' },
                { model: User, as: 'to' },
            ],
            order: [['createdAt', 'DESC']],
        })
    }

    public static async getOneAsync(where: any): Promise<Conversation | null> {
        return this.findOne<Conversation>({
            where,
            include: [
                { model: User, as: 'from' },
                { model: User, as: 'to' },
            ],
        })
    }

    public static async createAsync(params: IAttributes): Promise<Conversation> {
        const conversation: Conversation = await Conversation.create(params)
        return conversation.save()
    }

    public static toDTO(conversation: Conversation) {
        return {
            id: conversation.id,
            to: conversation.to ? User.toDTO(conversation.to) : conversation.toId,
            from: conversation.from ? User.toDTO(conversation.from) : conversation.fromId,
            createdAt: conversation.createdAt,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public fromId

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public toId

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt

    @BelongsTo(() => User, 'fromId')
    public from

    @BelongsTo(() => User, 'toId')
    public to

    @HasMany(() => Proposal)
    public proposals

    @HasMany(() => Message)
    public messages
}

export { IAttributes, Conversation }
