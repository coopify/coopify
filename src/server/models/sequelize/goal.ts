import {
    Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany, ForeignKey,
    BelongsTo, BelongsToMany, CreatedAt, UpdatedAt,
} from 'sequelize-typescript'
import { ErrorPayload } from '../../errorPayload'
import { UserGoal } from './userGoal'
import { User } from './user'

interface IAttributes {
    name: string
    description: string
    amount: number
    code: string
}

interface IUpdateAttributes {
    description: string
    amount: number
}

@Table({ tableName: 'Goal' })
class Goal extends Model<Goal> {

    public static async getAsync(id: string): Promise<Goal | null> {
        return this.findByPk<Goal>(id)
    }

    public static async getManyAsync(where: any, limit?: number, skip?: number): Promise<{ rows: Goal[], count: number } | null> {
        return this.findAndCountAll<Goal>({
            where,
            limit,
            offset: skip,
        })
    }

    public static async getManyUserGoalsAsync(where: any, limit?: number, skip?: number): Promise<{ rows: Goal[], count: number } | null> {
        return this.findAndCountAll<Goal>({
            where,
            limit,
            offset: skip,
        })
    }

    public static async getOneAsync(where: any): Promise<Goal | null> {
        return this.findOne<Goal>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<Goal> {
        const goal: Goal = await Goal.create(params)
        return goal.save()
    }

    public static async updateAsync(idToUpdate: string, params: IUpdateAttributes): Promise<Goal | null> {
        const goalToUpdate: Goal | null = await this.getAsync(idToUpdate)
        if (goalToUpdate) {
            return goalToUpdate.update(params)
        }
        throw (new ErrorPayload(404, 'Goal not found'))
    }

    public static toDTO(goal: Goal) {
        return {
            id: goal.id,
            name: goal.name,
            description: goal.description,
            amount: goal.amount,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @AllowNull(false)
    @Column(DataType.TEXT)
    public name

    @AllowNull(false)
    @Column(DataType.TEXT)
    public description

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public amount

    @AllowNull(false)
    @Column(DataType.STRING)
    public code

    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt

    @BelongsToMany(() => User, () => UserGoal)
    public users
}

export { IAttributes, IUpdateAttributes, Goal }
