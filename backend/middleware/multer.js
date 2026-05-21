// Multer is a library that handles file uploads (images, PDFs, etc.). Without it, Express can't process files sent from the frontend.

import multer from 'multer';
import path from 'path'

// ----- Storage configuration -----

// Where/how to save the file
const storage = multer.diskStorage({
    filename:function(req, file, callback) {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}` 
        callback(null, unique) // when a file arrives, save it using its original name; the null means "no error"
    }
})

// Only allow images; reject everything else before it touches disk
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

// using this 'storage', we'll create an upload middleware that we'll use in our routes

const upload = multer({storage, filter, limits:{fileSize: 5 * 1024 * 1024}});   // 5 MB max per file

export default upload;