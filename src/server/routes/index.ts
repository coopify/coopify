import { Router } from 'express'
import userRoutes from './users'
import offerRoutes from './offers'
import categoryRoutes from './categories'
import conversationRoutes from './conversation'
import messageRoutes from './message'
import { loadLoggedUser } from '../controllers/users'

const router = Router()

router.use('*', loadLoggedUser)

router.use('/users', userRoutes)
router.use('/offers', offerRoutes)
router.use('/categories', categoryRoutes)
router.use('/conversations', conversationRoutes)
router.use('/messages', messageRoutes)

export { router }
