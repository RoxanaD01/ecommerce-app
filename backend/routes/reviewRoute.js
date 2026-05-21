import express from 'express'
import authUser from '../middleware/auth.js'
import { addReview, getReviews } from '../controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post('/', authUser, addReview )
reviewRouter.get('/:productId', getReviews )

export default reviewRouter
