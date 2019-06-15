import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Offer } from './offer'
import { User } from './user'
import { Proposal } from './proposal'

interface IAttributes {
    offerId: string
    proposalId: string
    reviewedUserId: string
    reviewerUserId: string
    rate: number
    description: string
}

@Table({ timestamps: true })
class Rate extends Model<Rate> {

    public static async getAsync(id: string): Promise<Rate | null> {
        return this.findById<Rate>(id, {
            include: [
                { model: User, as: 'reviewerUser' },
            ],
        })
    }

    public static async getManyAsync(where: any): Promise<Rate[] | null> {
        return this.findAll<Rate>({
            where,
            include: [
                { model: User, as: 'reviewerUser' },
            ],
            order: [['createdAt', 'DESC']],
        })
    }

    public static async getOneAsync(where: any): Promise<Rate | null> {
        return this.findOne<Rate>({
            where,
            include: [
                { model: User, as: 'reviewerUserId' },
            ],
        })
    }

    public static async createAsync(params: IAttributes): Promise<Rate> {
        const rate: Rate = await new Rate(params)
        return rate.save()
    }

    public static toDTO(rate: Rate) {
        return {
            id: rate.id,
            offerId: rate.offerId,
            proposalId: rate.proposalId,
            reviewer: User.toDTO(rate.reviewerUser),
            description: rate.description,
            rate: rate.rate,
        }
    }

    @PrimaryKey
    @Default(DataType.UUIDV1)
    @Column(DataType.UUID)
    public id

    @ForeignKey(() => Offer)
    @AllowNull(false)
    @Column(DataType.UUID)
    public offerId

    @ForeignKey(() => Proposal)
    @AllowNull(false)
    @Column(DataType.UUID)
    public proposalId

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public reviewedUserId

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public reviewerUserId

    @AllowNull(false)
    @Column(DataType.STRING)
    public description

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public rate

    @BelongsTo(() => Offer)
    public ratedOffer

    @BelongsTo(() => Proposal)
    public ratedProposal

    @BelongsTo(() => User, 'reviewedUserId')
    public reviewedUser

    @BelongsTo(() => User, 'reviewerUserId')
    public reviewerUser

}

export { IAttributes, Rate }
