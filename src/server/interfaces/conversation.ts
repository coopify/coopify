import { Conversation, ConversationAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'
import { UserInterface } from '.'

export async function getAsync(id: string): Promise<Conversation | null> {
    try {
        const conversationInstance = await Conversation.getAsync(id)

        return conversationInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: any): Promise<Conversation[] | null> {
    try {
        const conversationInstances = await Conversation.getManyAsync(where)

        return conversationInstances
    } catch (error) {
        logger.error(new Error(error) + JSON.stringify(error))
        throw error
    }
}

export async function findOneAsync(where: any): Promise<Conversation | null> {
    try {
        const conversationInstance = await Conversation.getOneAsync(where)

        return conversationInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: ConversationAttributes): Promise<Conversation | null> {
    try {
        const to = await UserInterface.getAsync(body.toId)
        if (!to) { throw new ErrorPayload(404, 'User not found') }
        const conversation = await Conversation.createAsync(body)
        return conversation
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
