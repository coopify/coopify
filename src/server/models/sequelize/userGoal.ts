import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey } from 'sequelize-typescript'
import { User } from './user'
import { Goal } from './goal'

interface IAttributes {
    userId: string
    goalId: string
    quantity: number
    code: string
}

interface IUpdateAttributes {
    userId: string
    goalId: string
    quantity: number
    code: string
}

@Table({ timestamps: true })
class UserGoal extends Model<UserGoal> {

    public static async getAsync(id: string): Promise<UserGoal | null> {
        return this.findById<UserGoal>(id)
    }

    public static async getManyAsync(where: any): Promise<UserGoal[] | null> {
        return this.findAll<UserGoal>({ where })
    }

    public static async getOneAsync(where: any): Promise<UserGoal | null> {
        return this.findOne<UserGoal>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<UserGoal> {
        const userGoal: UserGoal = await new UserGoal(params)
        return userGoal.save()
    }

    public static async updateAsync(userGoal: UserGoal, params: IUpdateAttributes): Promise<UserGoal> {
        const updatedGoal = await userGoal.update(params)
        return updatedGoal.save()
    }

    public static toDTO(userGoal: UserGoal) {
        return {
            id: userGoal.id,
            userId: userGoal.userId,
            goalId: userGoal.goalId,
            quantity: userGoal.quantity,
            code: userGoal.code,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public userId

    @ForeignKey(() => Goal)
    @AllowNull(false)
    @Column(DataType.UUID)
    public goalId

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public quantity

    @AllowNull(false)
    @Column(DataType.STRING)
    public code
}

export { IAttributes, UserGoal, IUpdateAttributes }
