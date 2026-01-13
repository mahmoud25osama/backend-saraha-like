import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import catchError from './catchError'
import { AppError } from '../utils/AppError'

interface JwtPayload {
    id: string
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
            }
        }
    }
}

export const protect = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.token

        if (!token) {
            return next(new AppError('Not authorized', 401))
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        ) as JwtPayload

        req.user = { id: decoded.id }
        next()
    }
)
