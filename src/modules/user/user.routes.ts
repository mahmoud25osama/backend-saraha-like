import express from 'express'
import { protect } from '../../middleware/auth'
import {
    getPublicProfile,
    updateProfile,
    checkUsername,
} from './user.controller'

const router = express.Router()

router.get('/profile/:username', getPublicProfile)
router.get('/check-username/:username', checkUsername)
router.put('/profile', protect, updateProfile)

export default router
