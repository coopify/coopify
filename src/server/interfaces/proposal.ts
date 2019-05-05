import { Proposal, ProposalAttributes, User, Conversation, ProposalUpdateAttributes } from '../models'
import { validateProposalStatus, handleError } from './helpers'
import { ErrorPayload } from '../errorPayload'
import { OfferInterface, ConversationInterface } from '.'
import { proposalStatusChangedEmail } from '../mailer';

export async function getAsync(id: string): Promise<Proposal | null> {
    try {
        const proposalInstance = await Proposal.getAsync(id)

        return proposalInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: any): Promise<Proposal[]> {
    try {
        const proposalInstances = await Proposal.getManyAsync(where)
        if (!proposalInstances) { throw new ErrorPayload(500, 'Failed to get offers') }

        return proposalInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: any): Promise<Proposal> {
    try {
        const proposalInstances = await Proposal.getOneAsync(where)
        if (!proposalInstances) { throw new ErrorPayload(500, 'Failed to get an offer') }

        return proposalInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(user: User, body: ProposalAttributes): Promise<Proposal> {
    try {
        if (body.exchangeMethod === 'Coopy') {
            if (!body.proposedPrice) { throw new ErrorPayload(400, 'Should provide a price') }
            if (!body.exchangeInstance) { throw new ErrorPayload(400, 'Should provide an exchange instance') }
        } else {
            if (!body.proposedServiceId) { throw new ErrorPayload(400, 'Should provide an offer id when exchanging') }
            const proposedOffer = await OfferInterface.getAsync(body.proposedServiceId)
            if (!proposedOffer) { throw new ErrorPayload(404, 'Offer not found') }
        }
        if (body.status) { validateProposalStatus(body.status) }
        const offer = await OfferInterface.getAsync(body.offerId)
        if (!offer) { throw new ErrorPayload(404, 'Offer not found') }
        if (offer.userId === user.id) { throw new ErrorPayload(401, 'You cant buy one of your services') }
        const conversation = await ConversationInterface.getAsync(body.conversationId)
        if (!conversation) { throw new ErrorPayload(404, 'Conversation not found') }
        if (conversation.toId !== user.id && conversation.fromId !== user.id) { throw new ErrorPayload(401, 'Cant buy services for other users') }
        body.proposerId = user.id
        let proposalInstance: Proposal | null = await Proposal.createAsync(body)
        if (!proposalInstance) { throw new ErrorPayload(500, 'Failed to create proposal') }
        proposalInstance = await Proposal.getAsync(proposalInstance.id)
        if (!proposalInstance) { throw new ErrorPayload(500, 'Failed to create proposal') }
        return proposalInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function updateAsync(proposal: Proposal, body: ProposalUpdateAttributes): Promise<Proposal> {
    try {
        if (body.exchangeMethod === 'Coopy') {
            if (!body.proposedPrice) { throw new ErrorPayload(400, 'Should provide a price') }
            if (!body.exchangeInstance) { throw new ErrorPayload(400, 'Should provide an exchange instance') }
        } else {
            if (!body.proposedServiceId) { throw new ErrorPayload(400, 'Should provide an offer id when exchanging') }
            const proposedOffer = await OfferInterface.getAsync(body.proposedServiceId)
            if (!proposedOffer) { throw new ErrorPayload(404, 'Offer not found') }
        }
        if (body.status) { validateProposalStatus(body.status) }
        const proposalInstance = await Proposal.updateAsync(proposal, body)
        if (!proposalInstance) { throw new ErrorPayload(500, 'Failed to update proposal') }
        return proposalInstance
    } catch (error) {
        throw handleError(error)
    }
}
