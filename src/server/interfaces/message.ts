import { Message, MessageAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { ConversationInterface } from '.'

export async function getAsync(id: string): Promise<Message | null> {
    try {
        const messageInstance = await Message.getAsync(id)

        return messageInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: any): Promise<Message[] | null> {
    try {
        const messageInstances = await Message.getManyAsync(where)

        return messageInstances
    } catch (error) {
        logger.error(new Error(error) + JSON.stringify(error))
        throw error
    }
}

export async function findOneAsync(where: any): Promise<Message | null> {
    try {
        const messageInstance = await Message.getOneAsync(where)

        return messageInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: MessageAttributes): Promise<Message | null> {
    try {
        const conversation = await ConversationInterface.getAsync(body.conversationId)
        if (!conversation) { throw new ErrorPayload(404, 'Conversation not found') }
        const message = await Message.createAsync(body)
        return message
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
