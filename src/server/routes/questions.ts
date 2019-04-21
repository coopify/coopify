import { Router } from 'express'
import { questionsController, usersController, offersController } from '../controllers'

const questionRoutes = Router()

questionRoutes.get('/', questionsController.getListAsync)
questionRoutes.get('/:questionId', questionsController.getOneAsync)

questionRoutes.put('/:questionId', usersController.authenticate, questionsController.updateAsync)

questionRoutes.post('/:offerId', usersController.authenticate, questionsController.createAsync)

questionRoutes.param('questionId', questionsController.loadAsync)
questionRoutes.param('offerId', offersController.loadAsync)

export default questionRoutes
