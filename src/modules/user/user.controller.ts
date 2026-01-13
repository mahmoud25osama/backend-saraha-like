import { NextFunction, Request, Response } from 'express'
import User from '../../database/models/User'
import catchError from '../../middleware/catchError'
import { AppError } from '../../utils/AppError'

// Get public profile by username
export const getPublicProfile = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { username } = req.params

        const user = await User.findOne({ username }).select(
            'name username bio avatar allowMessages'
        )

        if (!user) {
            return next(new AppError('User not found', 404))
        }

        res.json(user)
    }
)
// Update user profile
export const updateProfile = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, bio, allowMessages } = req.body

        const user = await User.findByIdAndUpdate(
            req.user?.id,
            { name, bio, allowMessages },
            { new: true, runValidators: true }
        )

        if (!user) {
            return next(new AppError('User not found', 404))
        }

        res.json(user)
    }
)

// Check username availability
export const checkUsername = catchError(async (req: Request, res: Response) => {
    const { username } = req.params
    const user = await User.findOne({ username })
    res.json({ available: !user })
})
