import { Router } from 'express'
import { usersController } from '../controllers'
import { authenticateRequest } from '../auth'

const userRoutes = Router()

userRoutes.get('/facebookURL', usersController.getFacebookAuthURLAsync)
userRoutes.get('/googleauthurl', usersController.googleAPIURLAsync)

userRoutes.post('/exchangecodefortoken', usersController.googleAPIExchangeCodeForTokenAsync)

userRoutes.post('/signup', usersController.signupAsync, usersController.generateTokenAsync)
userRoutes.post('/facebook/signup', usersController.exchangeFacebookCodeAsync, usersController.generateTokenAsync)
userRoutes.post('/login', usersController.loginAsync, usersController.generateTokenAsync)
userRoutes.post('/:userid/logout', usersController.logoutAsync)

userRoutes.param('userId', usersController.loadAsync)

export default userRoutes
