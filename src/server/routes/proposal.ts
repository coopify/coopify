import { Router } from 'express'
import { proposalController, usersController, conversationController } from '../controllers'

const proposalRoutes = Router()

proposalRoutes.get('/', usersController.authenticate, proposalController.getListAsync)
proposalRoutes.get('/:conversationId', usersController.authenticate, proposalController.getListOfAConversationAsync)
proposalRoutes.get('/:proposalId', usersController.authenticate, proposalController.getOneAsync)

proposalRoutes.post('/:conversationId', usersController.authenticate, proposalController.createAsync)

proposalRoutes.param('proposalId', proposalController.loadAsync)
proposalRoutes.param('conversationId', conversationController.loadAsync)

export default proposalRoutes