import { Router } from 'express'
import { offersController, usersController } from '../controllers'

const bidRoutes = Router()

//bidRoutes.get('/:bidId', offersController.)

bidRoutes.post('/createBid', usersController.authenticate, offersController.createOffferAsync)

bidRoutes.param('bidId', offersController.loadAsync)

export default bidRoutes