import { NextFunction, Request, Response } from 'express'
import { ProposalInterface, ConversationInterface, UserInterface, OfferInterface } from '../interfaces'
import { handleError } from './helpers'
import { Proposal, Conversation, User } from '../models'
import { ErrorPayload } from '../errorPayload'
import { blockchain } from '../services'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const proposal = await ProposalInterface.getAsync(id)

        if (!proposal) { throw new ErrorPayload(404, 'Proposal not found') }

        response.locals.proposal = proposal
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const proposal: Proposal = response.locals.proposal
        if (!proposal) { throw new ErrorPayload(404, 'Proposal not found') }
        response.status(200).json({ proposal: Proposal.toDTO(proposal) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const loggedUser = response.locals.loggedUser
        if (!loggedUser) { throw new ErrorPayload(403, 'You need to be logged in') }
        const conversations = await ConversationInterface.findAsync({ $or: [{ fromId: loggedUser.id }, { toId: loggedUser.id }] })
        if (!conversations) { throw new ErrorPayload(500, 'Failed to get conversations') }
        const proposals = await ProposalInterface.findAsync({ id: { $in: conversations.map((c) => c.id) } })
        if (!proposals) { throw new ErrorPayload(500, 'Failed to get offers') }
        response.status(200).json({ proposals: proposals.map((p) => Proposal.toDTO(p)) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListOfAConversationAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const conversation: Conversation = response.locals.conversation
        if (!loggedUser) { throw new ErrorPayload(403, 'You need to be logged in') }
        if (!conversation) { throw new ErrorPayload(404, 'Conversation not found') }
        const conversations = await ConversationInterface.findAsync({ $or: [{ fromId: loggedUser.id }, { toId: loggedUser.id }], conversationId: conversation.id })
        if (!conversations) { throw new ErrorPayload(500, 'Failed to get conversations') }
        const proposals = await ProposalInterface.findAsync({ id: { $in: conversations.map((c) => c.id) } })
        if (!proposals) { throw new ErrorPayload(500, 'Failed to get offers') }
        response.status(200).json({ proposals: proposals.map((p) => Proposal.toDTO(p)) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const conversation: Conversation = response.locals.conversation
        const { offerId, exchangeMethod, proposedServiceId, exchangeInstance, proposedPrice } = request.body
        if (!offerId || !exchangeMethod) { throw new ErrorPayload(400, 'Missing required data') }

        const proposal = await ProposalInterface.createAsync(loggedUser, {
            offererId: loggedUser.id,
            conversationId: conversation.id,
            exchangeMethod,
            offerId,
            proposedPrice,
            exchangeInstance,
            proposedServiceId,
            status: 'Waiting',
        })

        if (!proposal) { throw new ErrorPayload(500, 'Failed to create a new proposal') }
        response.status(200).json({ proposal: Proposal.toDTO(proposal) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function acceptAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const proposal: Proposal = response.locals.proposal
        const conversation: Conversation = proposal.conversation
        if (proposal.status !== 'Waiting') { throw new ErrorPayload(400, 'You cant accept this proposal due to its state') }
        if (loggedUser.id !== conversation.fromId && loggedUser.id !== conversation.toId) { throw new ErrorPayload(400, 'Cant accept another user proposal') }
        if (proposal.offererId === loggedUser.id) { throw new ErrorPayload(400, 'You cant propose and accept a proposal') }
        const from = await UserInterface.getAsync(proposal.conversation.fromId)
        const to = await UserInterface.getAsync(proposal.conversation.toId)
        const offer = await OfferInterface.getAsync(proposal.purchasedOffer.toId)
        if (!from || !to) { throw new ErrorPayload(404, 'User not found') }
        if (!offer) { throw new ErrorPayload(404, 'Offer not found') }
        blockchain.transfer({ from, to, offer, proposal })
        const updatedProposal = await ProposalInterface.updateAsync(proposal.id, { ...proposal, status: 'PaymentPending' })
        response.status(200).json({ proposal: Proposal.toDTO(updatedProposal) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function rejectAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const proposal: Proposal = response.locals.proposal
        const conversation: Conversation = proposal.conversation
        if (proposal.status !== 'Waiting') { throw new ErrorPayload(400, 'You cant reject this proposal due to its state') }
        if (loggedUser.id !== conversation.fromId && loggedUser.id !== conversation.toId) { throw new ErrorPayload(400, 'Cant reject another user proposal') }
        if (proposal.offererId === loggedUser.id) { throw new ErrorPayload(400, 'You cant propose and reject a proposal') }
        const updatedProposal = await ProposalInterface.updateAsync(proposal.id, { ...proposal, status: 'Rejected' })
        response.status(200).json({ proposal: Proposal.toDTO(updatedProposal) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function cancelAsync(request: Request, response: Response) {
    try {
        const loggedUser: User = response.locals.loggedUser
        const proposal: Proposal = response.locals.proposal
        const conversation: Conversation = proposal.conversation
        if (proposal.status !== 'Waiting') { throw new ErrorPayload(400, 'You cant cancel this proposal due to its state') }
        if (loggedUser.id !== conversation.fromId && loggedUser.id !== conversation.toId) { throw new ErrorPayload(400, 'Cant cancel another user proposal') }
        if (proposal.offererId !== loggedUser.id) { throw new ErrorPayload(400, 'You cant propose and reject a proposal') }
        const updatedProposal = await ProposalInterface.updateAsync(proposal.id, { ...proposal, status: 'Cancelled' })
        response.status(200).json({ proposal: Proposal.toDTO(updatedProposal) })
    } catch (error) {
        handleError(error, response)
    }
}
