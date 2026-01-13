import { NextFunction, Request, Response } from 'express'
import User from '../../database/models/User'
import Message from '../../database/models/Message'
import catchError from '../../middleware/catchError'
import { AppError } from '../../utils/AppError'

// Send anonymous message
export const sendMessage = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { username } = req.params
        const { content } = req.body
        // Find recipient by username
        const recipient = await User.findOne({ username })
        if (!recipient) {
            return next(new AppError('User not found', 404))
        }

        if (!recipient.allowMessages) {
            return next(
                new AppError('This user is not accepting messages', 403)
            )
        }
        // Create message
        const message = await Message.create({
            recipient: recipient._id,
            content,
        })

        // Increment message count
        await User.findByIdAndUpdate(recipient._id, {
            $inc: { messageCount: 1 },
        })

        res.status(201).json({
            message: 'Message sent successfully',
            data: message,
        })
    }
)

// Get all messages for authenticated user
export const getMyMessages = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 20, filter } = req.query
        const skip = (Number(page) - 1) * Number(limit)

        let query: any = {
            recipient: req.user?.id,
            isDeleted: false,
        }

        // Apply filters
        if (filter === 'unread') {
            query.isRead = false
        } else if (filter === 'favorites') {
            query.isFavorite = true
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        const total = await Message.countDocuments(query)

        res.json({
            messages,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total,
        })
    }
)

// Mark message as read
export const markAsRead = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const message = await Message.findOneAndUpdate(
            { _id: id, recipient: req.user?.id },
            { isRead: true },
            { new: true }
        )
        if (!message) {
            return next(new AppError('Message not found', 404))
        }
        res.json(message)
    }
)

// Toggle favorite
export const toggleFavorite = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params

        const message = await Message.findOne({
            _id: id,
            recipient: req.user?.id,
        })

        if (!message) {
            return next(new AppError('Message not found', 404))
        }

        message.isFavorite = !message.isFavorite
        await message.save()

        res.json(message)
    }
)

// Delete message
export const deleteMessage = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const message = await Message.findOneAndUpdate(
            { _id: id, recipient: req.user?.id },
            { isDeleted: true },
            { new: true }
        )
        if (!message) {
            return next(new AppError('Message not found', 404))
        }
        res.json({ message: 'Message deleted successfully' })
    }
)

// Get message statistics
export const getStats = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
        const totalMessages = await Message.countDocuments({
            recipient: req.user?.id,
            isDeleted: false,
        })

        const unreadCount = await Message.countDocuments({
            recipient: req.user?.id,
            isRead: false,
            isDeleted: false,
        })

        const favoritesCount = await Message.countDocuments({
            recipient: req.user?.id,
            isFavorite: true,
            isDeleted: false,
        })

        res.json({
            totalMessages,
            unreadCount,
            favoritesCount,
        })
    }
)
