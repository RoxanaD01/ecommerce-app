import express from 'express'
import { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } from '../controllers/userController.js'
import rateLimit from 'express-rate-limit'
import authUser from '../middleware/auth.js'

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  
    max: 10,
    message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
})

const userRouter = express.Router();

userRouter.post('/register', authLimiter,registerUser)
userRouter.post('/login', authLimiter, loginUser)
userRouter.post('/admin', authLimiter, adminLogin)

// Forgot / reset password 
userRouter.post('/forgot-password', authLimiter, forgotPassword)
userRouter.post('/reset-password/:token', authLimiter, resetPassword)

// User Profile 
userRouter.get('/profile', authUser, getProfile)
userRouter.post('/profile', authUser, updateProfile)
userRouter.post('/change-password', authUser, changePassword)

export default userRouter;    