import { Router } from 'express'
import userRoutes from './users'
import bidRoutes from './bids'
import { loadLoggedUser } from '../controllers/users'

const router = Router()

router.use('*', loadLoggedUser)

router.use('/users', userRoutes)
router.use('/bids', bidRoutes)

export { router }
