import express from 'express'
import { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } from '../controllers/userController.js'
import rateLimit from 'express-rate-limit'
import authUser from '../middleware/auth.js'

 
// Rate limiter: max 10 attempts per IP every 15 minutes.
// This prevents brute-force attacks on login/register/forgot-password.
// Without this, an attacker can try thousands of passwords per second.

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,
    message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// ----- Create router using express router -----

// It will create one userRouter and using this router we will create the GET / POST method
const userRouter = express.Router();

userRouter.post('/register', authLimiter,registerUser)
userRouter.post('/login', authLimiter, loginUser)
userRouter.post('/admin', authLimiter, adminLogin)

// Forgot / reset password — both public (no auth middleware)
userRouter.post('/forgot-password', authLimiter, forgotPassword)
userRouter.post('/reset-password/:token', authLimiter, resetPassword)

// User Profile - require login
userRouter.get('/profile', authUser, getProfile)
userRouter.post('/profile', authUser, updateProfile)
userRouter.post('/change-password', authUser, changePassword)



export default userRouter;    // using this userRouter we'll create the endpoints