// This middleware authenticates users on protected routes.
// It reads the standard "Authorization: Bearer <token>" header, verifies the JWT, and attaches userId to req.body for downstream use.

import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    // Read the standard Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({success: false, message: 'Not Authorized. Login Again'})
    }

    const token = authHeader.split(' ')[1]    // extract the token after "Bearer "

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id    // userId udef for adding, removing etc comes from token id
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please log in again' })
        }
        return res.status(401).json({ success: false, message: 'Invalid token. Please log in again' })
    }
}

export default authUser;