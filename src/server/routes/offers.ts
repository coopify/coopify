import { Router } from 'express'
import { offersController, usersController } from '../controllers'

const offerRoutes = Router()

offerRoutes.get('/', offersController.getListAsync)
offerRoutes.get('/:offerId', offersController.getOneAsync)
offerRoutes.get('/user/:userId', offersController.getFromUserAsync)
offerRoutes.get('/questions/:offerId', offersController.getQuestionsListAsync)

offerRoutes.post('/', usersController.authenticate, offersController.createAsync)

offerRoutes.param('offerId', offersController.loadAsync)
offerRoutes.param('userId', usersController.loadAsync)

export default offerRoutes
