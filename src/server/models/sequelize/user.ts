import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, AfterCreate } from 'sequelize-typescript'
import { rdb } from '../../services'

interface IAttributes {
    email: string
    password: string
    pictureURL?: string
    FBAccessToken?: string
    FBRefreshToken?: string
    googleAccessToken?: string
    googleRefreshToken?: string
    name?: string

}

@Table({ timestamps: true })
class User extends Model<User> {
    @AfterCreate
    public static sendConfirmationEmail() {
        // TODO
    }

    public static async getAsync(id: string): Promise<User | null> {
        return this.findById<User>(id)
    }

    public static async getManyAsync(where: any): Promise<User[] | null> {
        return this.findAll<User>({ where })
    }

    public static async createAsync(params: IAttributes): Promise<User> {
        const user: User = await new User(params)
        return user.save()
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
    public name

    @Default(false)
    @Column(DataType.BOOLEAN)
    public isVerified

    @Column(DataType.STRING)
    public FBAccessToken

    @Column(DataType.STRING)
    public FBRefreshToken

    public toDTO() {
        return {
            id: this.id,
            email: this.email,
            pictureURL: this.pictureURL,
            resetToken: this.resetToken,
            isVerified: this.isVerified,
        }
    }
}

export { IAttributes, User }
