import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not Authorized! Login Again" });
        }

        const token = authHeader.split(' ')[1]  
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access only" }); 
        }
    
        next();

    } catch (error) { next(error) }
}

export default adminAuth

