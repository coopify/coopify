import { Router } from 'express'
import { offersController, usersController } from '../controllers'

const offerRoutes = Router()

offerRoutes.get('/', offersController.getListAsync)
offerRoutes.get('/:offerId', offersController.getOneAsync)

offerRoutes.post('/', usersController.authenticate, offersController.createAsync)

offerRoutes.param('offerId', offersController.loadAsync)

export default offerRoutes