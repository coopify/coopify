import { Router } from 'express'
import { bidsController } from '../controllers'

const bidRoutes = Router()

bidRoutes.param('bidId', bidsController.loadAsync)

bidRoutes.post('/createBid', bidsController.createBidAsync)

export default bidRoutes