import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from '../src/modules/auth/auth.routes'
import messageRoutes from '../src/modules/message/message.routes'
import userRoutes from '../src/modules/user/user.routes'
import { AppError } from '../src/utils/AppError'
import { errorHandle } from '../src/middleware/errorHandle'
// import ServerlessHttp from 'serverless-http'
import { dbConn } from '../src/database/dbConnection'

// Load environment variables
dotenv.config()
// Initialize Express app
const app = express()

// Connect to database
dbConn()
// Middlewares
// Enable CORS
const allowedOrigins: string[] = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
].filter((url): url is string => typeof url === 'string')

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/auth', authRoutes)
app.use('/messages', messageRoutes)
app.use('/users', userRoutes)

//unhandled routes
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Route not found ${req.originalUrl}`, 404))
})
// Error handling middleware
app.use(errorHandle)
// Start the server for local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}
// start for vercel
export default app
