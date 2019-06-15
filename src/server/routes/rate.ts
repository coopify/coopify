import { Router } from 'express'
import { ratesController, usersController, offersController } from '../controllers'

const routes = Router()

routes.get('/', ratesController.getListAsync)
routes.get('/:rateId', ratesController.getOneAsync)
routes.get('/:offerId/reviewable', usersController.authenticate, ratesController.reviewableAsync)

routes.post('/:offerId', usersController.authenticate, ratesController.createAsync)

routes.param('rateId', ratesController.loadAsync)
routes.param('offerId', offersController.loadAsync)

export default routes
