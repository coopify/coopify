import { Router } from 'express'
import { conversationController, usersController } from '../controllers'

const offerRoutes = Router()

offerRoutes.get('/', conversationController.getListAsync)
offerRoutes.get('/:conversationId', conversationController.getOneAsync)

offerRoutes.post('/', usersController.authenticate, conversationController.createAsync)

offerRoutes.param('offerId', conversationController.loadAsync)
offerRoutes.param('conversarionId', conversationController.loadAsync)

export default offerRoutes
