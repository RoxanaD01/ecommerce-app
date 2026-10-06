import userModel from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import transporter from '../config/nodemailer.js'

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

const loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)  

        if (isMatch) {
            const token = createToken(user._id);
            res.json({success:true, token})
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        
    } catch (error) { next(error) }
}

const registerUser = async (req, res, next) => {

   try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({email});
        if(exists) {
            return res.status(409).json({ success: false, message: 'User already exists' })
        }

        if(!validator.isEmail(email)) { 
            return res.status(400).json({ success: false, message: 'Please enter a valid email' })
        }

        if(!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            return res.status(400).json({success: false, message: 'Password must be at least 8 characters and include uppercase, lowercase, a number and a symbol'})
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // create user account
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.status(201).json({ success: true, token })

   } catch (error) { next(error) }
}

const adminLogin = async (req, res, next) => {

    try {
        
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' })
        }

        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD)
        if (isMatch) {
            const token = jwt.sign(
                {role: 'admin', email},
                process.env.JWT_SECRET,
                {expiresIn: '1d'}
            )
            res.status(200).json({ success: true, token })
        } else {
            res.status(401).json({ success: false, message: 'Invalid admin credentials' })
        }

    } catch (error) { next(error) }
}

const forgotPassword = async (req, res, next) => {

    try {
        
        const { email } = req.body;
        
        const user = await userModel.findOne({ email })

        if(!user) {
            return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' })
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;  
        await user.save();

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`

        // Send the email
        await transporter.sendMail({
            from:`"Demure" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Reset Password Request',
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 8px;" >
                    <h2 style="margin-top: 0;">Reset password</h2>
                    <p>Hi ${user.name},</p>
                    <p>We received a request to reset your password. Click the button below to choose a new one.</p>
                    <p>This link expires in <strong> 1 hour</strong></p>
                    <a href="${resetPasswordUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
                    <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0" />
                    <p style="color: #aaa; font-size: 12px;">Demure &mdash; ${process.env.FRONTEND_URL}</p>
                </div>
            `
        })
        
        res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' })

    } catch (error) { next(error) }
}

const resetPassword = async (req, res, next) => {

    try {
        const {token} = req.params;
        const {password} = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: Date.now()}  // expiry must be in the future
        })

        if(!user) {
            return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' })
        }

        if(!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters and include uppercase, lowercase, a number and a symbol'
            })
        }

        // Hash the new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' })

    } catch (error) { next(error) }
}

// ----- MY PROFILE -----
const getProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId).select('-password -resetPasswordToken -resetPasswordExpires')

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        } 

        res.json({ success: true, user })

    } catch (error) { next(error) }
}

const updateProfile = async (req, res, next) => {
    try {
        
        const { name, phone } = req.body

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
        }

        const updatedUser = await userModel.findByIdAndUpdate(req.userId,
            {
                name: name.trim(),
                phone: phone?.trim() || ''   
            },
            {new: true}   
        ).select('-password -resetPasswordToken -resetPasswordExpires')

        res.json({ success: true, user: updatedUser, message: 'Profile updated successfully' })

    } catch (error) { next(error) }
}

const changePassword = async (req, res, next) => {
    try {
       
        const { currentPassword, newPassword } = req.body
        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        } 

        const passMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' })
        }

        if(!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters and include uppercase, lowercase, a number and a symbol'
            })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.json({ success: true, message: 'Password changed successfully' })

    } catch (error) { next(error) }
}

export { loginUser, registerUser, adminLogin, resetPassword, forgotPassword, getProfile, updateProfile, changePassword }  