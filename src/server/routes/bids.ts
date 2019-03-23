import { Router } from 'express'
import { bidsController, usersController } from '../controllers'

const bidRoutes = Router()

//bidRoutes.get('/:bidId', bidsController.)

bidRoutes.post('/createBid', usersController.authenticate, bidsController.createBidAsync)

bidRoutes.param('bidId', bidsController.loadAsync)

export default bidRoutes