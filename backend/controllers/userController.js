// Here we can create the logic. Using that, we can allow the user to create an account or log in on the website
import userModel from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import transporter from '../config/nodemailer.js'

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

// ----- Route for User Login -----
const loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)  // password from body compared with password from DB

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

        // Checking if user already exists or not
        const exists = await userModel.findOne({email});
        if(exists) {
        // 409 Conflict — userul deja există în baza de date
            return res.status(409).json({ success: false, message: 'User already exists' })
        }

        // Validating email format & strong password 
        // if email & password pass validation then we create the account for the user
        
        if(!validator.isEmail(email)) { 
            // 400 Bad Request — datele trimise sunt invalide
            return res.status(400).json({ success: false, message: 'Please enter a valid email' })
        }

        if(!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            // 400 Bad Request — parola slabă
            return res.status(400).json({success: false, message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number'})
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

        // after storing the user in DB, we will provide one token. Using that, the user can login in the application.
        // the token will pe created using the user's ID property. Whenever the user will be created, in their property will be generated one '_id' 

        const token = createToken(user._id)
        // 201 Created — cont nou creat cu succes
        res.status(201).json({ success: true, token })

   } catch (error) { next(error) }
}

// ----- Route for Admin Login -----

const adminLogin = async (req, res, next) => {

    try {
        
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL) {
            // 401 Unauthorized — credențiale admin greșite
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

// ----- Forgot Password -----
const forgotPassword = async (req, res, next) => {

    try {
        
        const { email } = req.body;
        

        const user = await userModel.findOne({ email })

        // Always respond with success so we don't reveal whether an email exists
        if(!user) {
            // 200 intentionat — nu vrem să dezvăluim dacă emailul există în sistem
            return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' })
        }

        // Generate a secure random token (raw = sent in email, hashed = stored in DB)
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        // Save hashed token + expiry to the user document
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;  // 1h from now
        await user.save();

        // Build the reset URL — points to the React frontend page
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

// ----- Reset Password ----- 
const resetPassword = async (req, res, next) => {

    try {
        const {token} = req.params;
        const {password} = req.body;

        // Hash the raw token from the URL to compare with what's stored
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with matching token that hasn't expired yet
        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: Date.now()}  // expiry must be in the future
        })

        if(!user) {
            // 400 Bad Request — tokenul e invalid sau expirat
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
                message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number'
            })
        }

        // Hash the new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)

        // Clear the reset token fields so the link can't be reused
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
                phone: phone?.trim() || ''   // optional chaining — înseamnă "dacă phone există, apelează .trim(), dacă nu există nu arunca eroare"
            },
            {new: true}   // returneaza userul dupa modificare, fara new: true, Mongo returneaza userul inainte de modificare
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
                message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number'
            })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.json({ success: true, message: 'Password changed successfully' })

    } catch (error) { next(error) }
}

export { loginUser, registerUser, adminLogin, resetPassword, forgotPassword, getProfile, updateProfile, changePassword }  