import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import catchError from '../../middleware/catchError'
import { AppError } from '../../utils/AppError'
import User from '../../database/models/User'

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    })
}

const sendToken = (res: Response, userId: string) => {
    const token = generateToken(userId)

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
    })
}

export const register = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, username, password } = req.body
        // Check if user exists
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        })
        if (userExists) {
            return next(
                new AppError(
                    userExists.email === email
                        ? 'Email already registered'
                        : 'Username already taken',
                    400
                )
            )
        }
        // Create user
        const user = await User.create({ name, email, username, password })
        sendToken(res, user._id.toString())
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
        })
    }
)

export const login = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select('+password')
        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Invalid credentials', 401))
        }
        sendToken(res, user._id.toString())
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            allowMessages: user.allowMessages,
        })
    }
)

export const getMe = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.user?.id)
        if (!user) {
            return next(new AppError('User not found', 404))
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            allowMessages: user.allowMessages,
            messageCount: user.messageCount,
        })
    }
)

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })
    res.sendStatus(200)
}
