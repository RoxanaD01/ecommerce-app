import multer from 'multer';
import path from 'path'

// Where/how to save the file
const storage = multer.diskStorage({
    filename:function(req, file, callback) {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}` 
        callback(null, unique) 
    }
})

const allowedExt = /\.(jpeg|jpg|png|webp)$/i
const filter = (req, file, callback) => {
    const allowedImgExt = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const checkExt = allowedExt.test(file.originalname)
    if (allowedImgExt.includes(file.mimetype) && checkExt) {
        callback(null, true)
    } else {
        callback(new Error ('Only image files (jpeg, jpg, png, webp) are allowed'), false)
    }
}

const upload = multer({storage, fileFilter:filter, limits:{fileSize: 5 * 1024 * 1024}});   // 5 MB max per file

export default upload;