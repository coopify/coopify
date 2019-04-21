import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, AfterCreate, HasMany } from 'sequelize-typescript'
import { rdb } from '../../services'
import { Conversation } from './conversation';

interface IAttributes {
    email: string
    password: string
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

@Table({ timestamps: true })
class User extends Model<User> {

    public static async getAsync(id: string): Promise<User | null> {
        return this.findById<User>(id)
    }

    public static async getManyAsync(where: any): Promise<User[] | null> {
        return this.findAll<User>({ where })
    }

    public static async getOneAsync(where: any): Promise<User | null> {
        return this.findOne<User>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<User> {
        const user: User = await new User(params)
        return user.save()
    }

    public static async updateAsync(userToEdit: User, params: IUpdateAttributes): Promise<User> {
        return userToEdit.update(params)
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

    @Column(DataType.STRING)
    public FBAccessToken

    @Column(DataType.STRING)
    public FBRefreshToken

    @Column(DataType.STRING)
    public FBId

    @HasMany(() => Conversation, 'fromId')
    public fromConversations

    @HasMany(() => Conversation, 'toId')
    public toConversations

}

export { IAttributes, IUpdateAttributes, User }
