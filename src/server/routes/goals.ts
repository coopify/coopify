import { Router } from 'express'
import { goalsController, usersController } from '../controllers'

const goalRoutes = Router()

goalRoutes.get('/', goalsController.getListAsync)
goalRoutes.get('/:goalId', goalsController.getOneAsync)
goalRoutes.get('/:userId', goalsController.getUserGoalsAsync)

goalRoutes.param('userId', usersController.loadAsync)
goalRoutes.param('goalId', goalsController.loadAsync)

export default goalRoutes
