import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey, HasMany, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { User } from './user'
import { Conversation } from './conversation'

interface IAttributes {
    authorId: string
    conversationId: string
    text: string
}

@Table({ tableName: 'Message' })
class Message extends Model<Message> {

    public static async getAsync(id: string): Promise<Message | null> {
        return this.findByPk<Message>(id)
    }

    public static async getManyAsync(where: any): Promise<Message[] | null> {
        return this.findAll<Message>({ where })
    }

    public static async getOneAsync(where: any): Promise<Message | null> {
        return this.findOne<Message>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Message> {
        const message: Message = await Message.create(params)
        return message.save()
    }

    public static toDTO(message: Message) {
        return {
            id: message.id,
            authorId: message.authorId,
            text: message.text,
            conversationId: message.conversationId,
            createdAt: message.createdAt,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public authorId

    @ForeignKey(() => Conversation)
    @AllowNull(false)
    @Column(DataType.UUID)
    public conversationId

    @AllowNull(false)
    @Column(DataType.TEXT)
    public text

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt

    @BelongsTo(() => Conversation)
    public converastion
}

export { IAttributes, Message }
