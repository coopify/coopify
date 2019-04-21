import { Router } from 'express'
import { messageController, usersController, conversationController } from '../controllers'

const messageRoutes = Router()

messageRoutes.get('/:conversationId', messageController.getListAsync)

messageRoutes.post('/:conversationId', usersController.authenticate, messageController.createAsync)

messageRoutes.param('conversationId', conversationController.loadAsync)

export default messageRoutes
