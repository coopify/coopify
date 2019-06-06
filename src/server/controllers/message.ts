import { NextFunction, Request, Response } from 'express'
import { MessageInterface, UserInterface } from '../interfaces'
import { Message, Conversation, User } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'
import { pusher, logger } from '../services'

export async function loadAsync(request: Request, response: Response, next: NextFunction, id: string) {
    try {
        const message = await MessageInterface.getAsync(id)

        if (!message) { return response.status(404).json(new ErrorPayload(404, 'Message not found')) }

        response.locals.message = message
        next()
    } catch (error) {
        handleError(error, response)
    }
}

export async function getOneAsync(request: Request, response: Response) {
    try {
        const message: Message = response.locals.message
        if (!message) { throw new ErrorPayload(404, 'Message not found') }
        response.status(200).json({ v: Message.toDTO(message) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function getListAsync(request: Request, response: Response) {
    try {
        const conversation: Conversation | null = response.locals.conversation
        if (!conversation) { throw new ErrorPayload(404, 'Conversation not found') }
        const messages = await MessageInterface.findAsync({ conversationId: conversation.id })
        if (!messages) { throw new ErrorPayload(500, 'Failed to get messages') }

        response.status(200).json({ messages: messages.map((message) => Message.toDTO(message)) })
    } catch (error) {
        handleError(error, response)
    }
}

export async function createAsync(request: Request, response: Response) {
    try {
        const text = request.body.text
        const loggedUser: User | null = response.locals.loggedUser
        const conversation: Conversation | null = response.locals.conversation
        if (!text) { throw new ErrorPayload(400, 'Missing required data') }
        if (!loggedUser) { throw new ErrorPayload(401, 'You need to be logged in to send messages') }
        if (!conversation) { throw new ErrorPayload(404, 'Conversation not found') }
        if (conversation.fromId !== loggedUser.id && conversation.toId !== loggedUser.id) { throw new ErrorPayload(403, 'Cant make a comment on other users conversations') }

        const to = await UserInterface.getAsync(loggedUser.id === conversation.fromId ? conversation.toId : conversation.fromId)
        if (!to) { throw new ErrorPayload(404, 'User not found') }

        const message = await MessageInterface.createAsync({
            authorId: response.locals.loggedUser.id, text, conversationId: response.locals.conversation.id,
        })

        if (!message) { throw new ErrorPayload(500, 'Failed to create message') }

        await pusher.sendMessageAsync({
            from: loggedUser,
            to,
            conversationId: conversation.id,
            text: message.text,
            authorId: loggedUser.id,
        })

        if (!message) { throw new ErrorPayload(500, 'Failed to create a new category') }

        response.status(200).json({ message: Message.toDTO(message) })
    } catch (error) {
        handleError(error, response)
    }
}
