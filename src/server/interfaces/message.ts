import { Message, MessageAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { ConversationInterface } from '.'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Message> {
    try {
        const messageInstance = await Message.getAsync(id)
        if (!messageInstance) { throw new ErrorPayload(404, 'Message not found') }

        return messageInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: any): Promise<Message[]> {
    try {
        const messageInstances = await Message.getManyAsync(where)
        if (!messageInstances) { throw new ErrorPayload(500, 'Failed to get messages') }

        return messageInstances
    } catch (error) {
        logger.error(new Error(error) + JSON.stringify(error))
        throw error
    }
}

export async function findOneAsync(where: any): Promise<Message | null> {
    try {
        const messageInstance = await Message.getOneAsync(where)
        //if (!messageInstance) { throw new ErrorPayload(404, 'Message not found') }

        return messageInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: MessageAttributes): Promise<Message> {
    try {
        const conversation = await ConversationInterface.getAsync(body.conversationId)
        if (!conversation) { throw new ErrorPayload(404, 'Conversation not found') }
        const message = await Message.createAsync(body)
        if (!message) { throw new ErrorPayload(500, 'Failed to create message') }
        return message
    } catch (error) {
        throw handleError(error)
    }
}
