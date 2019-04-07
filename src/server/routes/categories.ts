import { Router } from 'express'
import { categoriesController, usersController } from '../controllers'

const categoryRoutes = Router()

categoryRoutes.get('/', categoriesController.getListAsync)
categoryRoutes.get('/:categoryId', categoriesController.getOneAsync)

categoryRoutes.post('/', usersController.authenticate, categoriesController.createAsync)

categoryRoutes.param('categoryId', categoriesController.loadAsync)

export default categoryRoutes
