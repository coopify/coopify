import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Offer } from './offer'
import { User } from './user'
import { Conversation } from './conversation'
import { ErrorPayload } from '../../errorPayload'

interface IAttributes {
    offerId: string
    proposerId: string
    purchasedOffer?: Offer
    conversationId: string
    conversation?: Conversation
    exchangeMethod: 'Coopy' | 'Exchange'
    exchangeInstance?: 'Hour' | 'Session' | 'FinalProduct'
    proposedPrice?: number
    proposedServiceId?: string
    proposedService?: Offer
    status: 'Waiting' | 'Rejected' | 'Confirmed' | 'PaymentPending' | 'PaymentFailed' | 'Cancelled' | 'Reviewed'
}

interface IUpdateAttributes {
    exchangeMethod: 'Coopy' | 'Exchange'
    exchangeInstance?: 'Hour' | 'Session' | 'FinalProduct'
    proposedPrice?: number
    proposedServiceId?: string
    proposedService?: Offer
    status: 'Waiting' | 'Rejected' | 'Confirmed' | 'PaymentPending' | 'PaymentFailed' | 'Cancelled' | 'Reviewed'
}

@Table({ timestamps: true })
class Proposal extends Model<Proposal> {

    public static async getAsync(id: string): Promise<Proposal | null> {
        return this.findById<Proposal>(id, {
            include: [
                { model: Offer, as: 'purchasedOffer' },
                { model: Offer, as: 'proposedService', required: false },
                { model: User },
            ],
        })
    }

    public static async getManyAsync(where: any): Promise<Proposal[] | null> {
        return this.findAll<Proposal>({
            where,
            include: [
                { model: Offer, as: 'purchasedOffer' },
                { model: Offer, as: 'proposedService', required: false },
                { model: User },
            ],
            order: [['createdAt', 'DESC']],
        })
    }

    public static async getOneAsync(where: any): Promise<Proposal | null> {
        return this.findOne<Proposal>({
            where, include: [
                { model: Offer, as: 'purchasedOffer' },
                { model: Offer, as: 'proposedService', required: false },
                { model: User },
            ],
        })
    }

    public static async createAsync(params: IAttributes): Promise<Proposal> {
        const proposal: Proposal = await new Proposal(params)
        return proposal.save()
    }

    public static async updateAsync(proposal: Proposal, params: IUpdateAttributes): Promise<Proposal> {
        const p = await proposal.update(params)
        return p.save()
    }

    public static toDTO(proposal: Proposal) {
        return {
            id: proposal.id,
            offerId: proposal.offerId,
            proposerId: proposal.proposerId,
            proposer: proposal.proposer ? User.toDTO(proposal.proposer) : undefined,
            conversationId: proposal.conversationId,
            exchangeMethod: proposal.exchangeMethod,
            purchasedOffer: proposal.purchasedOffer ? Offer.toDTO(proposal.purchasedOffer) : undefined,
            proposedService: proposal.proposedService ? Offer.toDTO(proposal.proposedService) : undefined,
            exchangeInstance: proposal.exchangeInstance,
            proposedPrice: proposal.proposedPrice,
            proposedServiceId: proposal.proposedServiceId,
            status: proposal.status,
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

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    public proposerId

    @ForeignKey(() => Conversation)
    @AllowNull(false)
    @Column(DataType.UUID)
    public conversationId

    @AllowNull(false)
    @Column(DataType.STRING)
    public exchangeMethod

    @AllowNull(true)
    @Column(DataType.STRING)
    public exchangeInstance

    @AllowNull(true)
    @Column(DataType.INTEGER)
    public proposedPrice

    @ForeignKey(() => Offer)
    @AllowNull(true)
    @Column(DataType.UUID)
    public proposedServiceId

    @AllowNull(false)
    @Column(DataType.STRING)
    public status

    @BelongsTo(() => Offer, 'offerId')
    public purchasedOffer

    @BelongsTo(() => Conversation, 'conversationId')
    public conversation

    @BelongsTo(() => Offer, 'proposedServiceId')
    public proposedService

    @BelongsTo(() => User)
    public proposer

}

export { IAttributes, Proposal, IUpdateAttributes }
