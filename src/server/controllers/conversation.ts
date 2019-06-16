import { NextFunction, Request, Response } from 'express'
import { ConversationInterface } from '../interfaces'
import { Conversation, User } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'
import { Op } from 'sequelize'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const conversation = await ConversationInterface.getAsync(id)

        response.locals.conversation = conversation
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const conversation: Conversation = response.locals.conversation

        response.status(200).json({ conversation: Conversation.toDTO(conversation) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const loggedUser: User | null = response.locals.loggedUser
        if (!loggedUser) { throw new ErrorPayload(401, 'Unauthorized you need to provide a valid token') }
        const conversations = await ConversationInterface.findAsync({ [Op.or]: [{ fromId: loggedUser.id }, { toId: loggedUser.id }] })

        response.status(200).json({ conversations: conversations.map((c) => Conversation.toDTO(c)) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const loggedUser: User | null = response.locals.loggedUser
        const toId = request.body.toId
        if (!loggedUser) { throw new ErrorPayload(401, 'Unauthorized you need to provide a valid token') }
        if (!toId) { throw new ErrorPayload(400, 'Missing required data') }
        if (toId === loggedUser.id) { throw new ErrorPayload(400, 'You cant start a conversation with your self') }

        const previousConversation = await ConversationInterface.findOneAsync({
            $or: [
                { fromId: response.locals.loggedUser.id, toId },
                { fromId: toId, toId: response.locals.loggedUser.id },
            ],
        })
        //const previousConversation2 = await ConversationInterface.findOneAsync({ fromId: toId, toId: response.locals.loggedUser.id })
        if (previousConversation) {
            response.status(200).json({ conversation: Conversation.toDTO(previousConversation) })
            //response.status(200).json({ conversation: previousConversation1 ? Conversation.toDTO(previousConversation1) : Conversation.toDTO(previousConversation2 as any) })
        } else {
            const conversation = await ConversationInterface.createAsync({ ...request.body, fromId: response.locals.loggedUser.id })
            response.status(200).json({ conversation: Conversation.toDTO(conversation) })
        }
    } catch (error) {
        handleError(error, response)
    }
}
