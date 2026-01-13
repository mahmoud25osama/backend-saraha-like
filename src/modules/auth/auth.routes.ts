import express from 'express'
import { getMe, login, logout, register } from './auth.controller'
import { protect } from '../../middleware/auth'

const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.get('/me', protect, getMe)

export default authRoutes
