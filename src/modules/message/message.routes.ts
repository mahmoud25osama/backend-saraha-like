import express from 'express'
import {
    deleteMessage,
    getMyMessages,
    getStats,
    markAsRead,
    sendMessage,
    toggleFavorite,
} from './message.controller'
import { protect } from '../../middleware/auth'

const messageRoutes = express.Router()

// Public route - send anonymous message
messageRoutes.post('/send/:username', sendMessage)

// Protected routes
messageRoutes.get('/my-messages', protect, getMyMessages)
messageRoutes.get('/stats', protect, getStats)
messageRoutes.patch('/:id/read', protect, markAsRead)
messageRoutes.patch('/:id/favorite', protect, toggleFavorite)
messageRoutes.delete('/:id', protect, deleteMessage)

export default messageRoutes
