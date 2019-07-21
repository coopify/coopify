import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { Offer } from './offer'
import { ErrorPayload } from '../../errorPayload'
import { User } from './user'

interface IAttributes {
    authorId: string
    offerId: string
    text: string
    response?: string
}

interface IUpdateAttributes {
    response: string
}

@Table({ tableName: 'Question' })
class Question extends Model<Question> {

    public static async getAsync(id: string): Promise<Question | null> {
        return this.findByPk<Question>(id)
    }

    public static async getManyAsync(where: any, limit?: number, skip?: number): Promise<{ rows: Question[], count: number } | null> {
        return this.findAndCountAll<Question>({
            where,
            limit,
            offset: skip,
            order: [['createdAt', 'ASC']],
        })
    }

    public static async getOneAsync(where: any): Promise<Question | null> {
        return this.findOne<Question>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Question> {
        const question: Question = await Question.create(params)
        return question.save()
    }

    public static async updateAsync(idToUpdate: string, params: IUpdateAttributes): Promise<Question | null> {
        const questionToUpdate: Question | null = await this.getAsync(idToUpdate)
        if (questionToUpdate) {
            return questionToUpdate.update(params)
        }
        throw (new ErrorPayload(404, 'Question not found'))
    }

    public static toDTO(question: Question) {
        return {
            id: question.id,
            authorId: question.authorId,
            offerId: question.offerId,
            text: question.text,
            response: question.response,
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

    @ForeignKey(() => Offer)
    @AllowNull(false)
    @Column(DataType.UUID)
    public offerId

    @AllowNull(false)
    @Column(DataType.TEXT)
    public text

    @AllowNull(true)
    @Column(DataType.TEXT)
    public response

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt
}

export { IAttributes, IUpdateAttributes, Question }
