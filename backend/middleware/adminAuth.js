// To authenticate the admin we'll create a middleware.
// We will add this middleware for those APIs where we need the admin permission like: adding/removing product, display orders etc

import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        
        // Read the standard Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not Authorized! Login Again" });
        }

        const token = authHeader.split(' ')[1]   // extract the token after "Bearer "

        // decode the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access only" }); 
        }
    
        next();

    } 
        // jwt.verify() throws if the token is invalid OR expired —
        // both cases are caught here and return the same 401-equivalent message.
        catch (error) { next(error) }
}

export default adminAuth

