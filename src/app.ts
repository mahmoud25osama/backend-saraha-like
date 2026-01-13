import { dbConn } from './database/dbConnection'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes'
import messageRoutes from './modules/message/message.routes'
import userRoutes from './modules/user/user.routes'
import { AppError } from './utils/AppError'
import { errorHandle } from './middleware/errorHandle'

// Load environment variables
dotenv.config()
// Initialize Express app
export const app = express()

// Connect to database
dbConn()
// Middlewares
// Enable CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

//unhandled routes
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Route not found ${req.originalUrl}`, 404))
})
// Error handling middleware
app.use(errorHandle)
// Start the server
