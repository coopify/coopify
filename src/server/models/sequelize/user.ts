import {
    Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, CreatedAt, UpdatedAt,
    HasMany, BelongsToMany, BeforeCreate,
} from 'sequelize-typescript'
import { Conversation } from './conversation'
import { UserGoal } from './userGoal'
import * as bcrypt from 'bcrypt-nodejs'
import { Goal } from './goal'
import { logger } from '../../services'
import { ErrorPayload } from '../../errorPayload'
import { Transaction } from 'sequelize'

interface IAttributes {
    email: string
    password: string
    referalCode: string
    pictureURL?: string
    FBId?: string
    FBAccessToken?: string
    FBRefreshToken?: string
    googleId?: string
    googleAccessToken?: string
    googleRefreshToken?: string
    name?: string
    lastName?: string
    birthdate?: Date
    bio?: string
    gender?: 'Male' | 'Female' | 'Other' | 'Unspecified' | string
    address?: string
    phone?: string
    interests?: Array<{ name: string, selected: boolean }>
}

interface IUpdateAttributes {
    pictureURL?: string
    FBAccessToken?: string
    googleAccessToken?: string
    name?: string
    lastName?: string
    birthdate?: Date
    bio?: string
    gender?: 'Male' | 'Female' | 'Other' | 'Unspecified' | string
    address?: string
    phone?: string
    interests?: Array<{ name: string, selected: boolean }>
}

@Table
class User extends Model<User> {

    @BeforeCreate
    public static async encryptPassword(instance: User) {
        try {
            bcrypt.hash(instance.password, null, null, (err, result) => {
                if (!err) {
                    instance.password = result
                } else {
                    throw new ErrorPayload(500, 'Failed to generate password', err)
                }
            })
        } catch (error) {
            logger.error(`USER MODEL => encryptPassword() for ${instance.id} failed with error: ${JSON.stringify(error)}`)
        }
    }

    public static async getAsync(id: string): Promise<User | null> {
        return this.findById<User>(id, {
            include: [
                { model: Goal },
            ],
        })
    }

    public static async getManyAsync(where: any): Promise<User[] | null> {
        return this.findAll<User>({ where })
    }

    public static async getOneAsync(where: any): Promise<User | null> {
        return this.findOne<User>({ where, include: [
                { model: Goal },
            ],
        })
    }

    public static async createAsync(params: IAttributes): Promise<User> {
        const user: User = await new User(params)
        return user.save()
    }

    public static async updateAsync(userToEdit: User, params: IUpdateAttributes, seqTransaction?: Transaction): Promise<User> {
        const updateUser = await userToEdit.update(params)
        if (seqTransaction) {
            return updateUser.save({ transaction: seqTransaction })
        } else {
            return updateUser.save()
        }
    }

    public static toDTO(user: User) {
        return {
            id: user.id,
            email: user.email,
            pictureURL: user.pictureURL,
            resetToken: user.resetToken,
            isVerified: user.isVerified,
            name: user.name,
            lastName: user.lastName,
            birthdate: user.birthdate,
            bio: user.bio,
            gender: user.gender,
            address: user.address,
            phone: user.phone,
            interests: user.interests,
            FBSync: user.FBId ? true : false,
            referalCode: user.referalCode,
            rateCount: user.rateCount,
            rateSum: user.rateSum,
            rating: user.rating,
            goals: user.goals && user.goals.length > 0 ? user.goals.map((g) => {
                return { ...Goal.toDTO(g), quantity: g.UserGoal.quantity }
            }) : [],
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @AllowNull(false)
    @Column(DataType.STRING)
    public password

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    public email

    @Column(DataType.STRING)
    public pictureURL

    @Column(DataType.STRING)
    public resetToken

    @Column(DataType.STRING)
    public googleAccessToken

    @Column(DataType.STRING)
    public googleRefreshToken

    @Column(DataType.STRING)
    public googleId

    @Column(DataType.STRING)
    public name

    @Column(DataType.STRING)
    public lastName

    @Column(DataType.DATE)
    public birthdate

    @Column(DataType.TEXT)
    public bio

    @Column(DataType.STRING)
    public gender

    @Column(DataType.STRING)
    public phone

    @Column(DataType.STRING)
    public address

    @Column(DataType.JSONB)
    public interests

    @Default(false)
    @Column(DataType.BOOLEAN)
    public isVerified

    @AllowNull(false)
    @Column(DataType.STRING)
    public referalCode

    @Column(DataType.STRING)
    public FBAccessToken

    @Column(DataType.STRING)
    public FBRefreshToken

    @Column(DataType.STRING)
    public FBId

    @Default(0)
    @Column(DataType.INTEGER)
    public rateCount

    @Default(0)
    @Column(DataType.INTEGER)
    public rateSum

    @Column({
        type: DataType.VIRTUAL,
        get(): number {
            const rateCount = this.get('rateCount')
            const rateSum = this.get('rateSum')
            return Math.round(rateSum / (rateCount > 0 ? rateCount : 1))
        },
    })

    public rating
    @CreatedAt
    @Column(DataType.DATE)
    public createdAt

    @UpdatedAt
    @Column(DataType.DATE)
    public updatedAt

    @HasMany(() => Conversation, 'fromId')
    public fromConversations

    @HasMany(() => Conversation, 'toId')
    public toConversations

    @BelongsToMany(() => Goal, () => UserGoal)
    public goals

    public async isValidPassword(password: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            bcrypt.compare(password, this.password, (err, res: boolean) => {
                if (!err) { resolve(res) } else {
                    throw new ErrorPayload(400, 'Wrong password')
                }
            })
        })
    }
}

export { IAttributes, IUpdateAttributes, User }
