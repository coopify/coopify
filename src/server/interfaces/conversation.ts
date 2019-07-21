import { Conversation, ConversationAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { UserInterface } from '.'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Conversation> {
    try {
        const conversationInstance = await Conversation.getAsync(id)
        if (!conversationInstance) { throw new ErrorPayload(404, 'Conversation not found') }
        return conversationInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: any): Promise<Conversation[]> {
    try {
        const conversationInstances = await Conversation.getManyAsync(where)
        if (!conversationInstances) { throw new ErrorPayload(500, 'Failed to get conversations') }

        return conversationInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: any): Promise<Conversation | null> {
    try {
        const conversationInstance = await Conversation.getOneAsync(where)
        //if (!conversationInstance) { throw new ErrorPayload(404, 'Conversation not found') }

        return conversationInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: ConversationAttributes): Promise<Conversation> {
    try {
        const to = await UserInterface.getAsync(body.toId)
        if (!to) { throw new ErrorPayload(404, 'User not found') }
        const conversation = await Conversation.createAsync(body)
        if (!conversation) { throw new ErrorPayload(500, 'Failed to create conversation') }
        return conversation
    } catch (error) {
        throw handleError(error)
    }
}
