import { Router } from 'express'
import { questionsController, usersController } from '../controllers'

const questionRoutes = Router()

questionRoutes.get('/', questionsController.getListAsync)
questionRoutes.get('/:questionId', questionsController.getOneAsync)

questionRoutes.put('/:questionId', usersController.authenticate, questionsController.updateAsync)

questionRoutes.post('/', usersController.authenticate, questionsController.createAsync)

questionRoutes.param('questionId', questionsController.loadAsync)

export default questionRoutes
