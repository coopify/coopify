import { Router } from 'express'
import { usersController } from '../controllers'

const userRoutes = Router()

userRoutes.get('/facebookURL', usersController.getFacebookAuthURLAsync)
userRoutes.get('/googleURL', usersController.googleAPIURLAsync)
userRoutes.get('/:userId/balance', usersController.getBalanceAsync)
userRoutes.get('/:userId/transactions', usersController.getTransactionsAsync)

userRoutes.put('/:userId', usersController.authenticate, usersController.validateOwner, usersController.updateAsync)

userRoutes.post('/signup', usersController.signupAsync, usersController.generateTokenAsync)
userRoutes.post('/facebook/signup', usersController.exchangeFacebookCodeAsync, usersController.generateTokenAsync)
userRoutes.post('/facebook/login', usersController.facebookLoginAsync, usersController.generateTokenAsync)
userRoutes.post('/google/signup', usersController.googleAPIExchangeCodeForTokenAsync, usersController.generateTokenAsync)
userRoutes.post('/google/login', usersController.googleLoginAsync, usersController.generateTokenAsync)
userRoutes.post('/login', usersController.loginAsync, usersController.generateTokenAsync)
userRoutes.post('/:userId/logout', usersController.logoutAsync)
userRoutes.post('/:userId/share', usersController.authenticate, usersController.didShareActionAsync)

userRoutes.param('userId', usersController.loadAsync)

export default userRoutes
