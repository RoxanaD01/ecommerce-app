import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";

const addReview = async (req, res, next) => {

    try {
        const {productId, rating, comment} = req.body;
        const userId = req.userId;

        if (!productId || !rating || !comment?.trim()) {
          return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        if (comment.trim().length < 5 || comment.trim().length > 600) {
          return res.status(400).json({ success: false, message: 'Comment must be 5–600 characters' })
        }

        const reviewDetails = {
            userId,
            productId: new mongoose.Types.ObjectId(productId),
            rating,
            comment
        };
        
        const newReview = new reviewModel(reviewDetails);
        await newReview.save()
        res.status(201).json({ success: true, message: "Review Added" })

      } catch (error) {

        if (error.code === 11000) {
          return res.status(409).json({ success: false, message: "You have already reviewed this product." })
        }

        next(error) 
      }
}

const getReviews = async (req, res, next) => {

  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ productId: new mongoose.Types.ObjectId(productId) })
      .populate('userId', 'name') 
      .sort({createdAt: -1}) 

    res.status(200).json({ success: true, reviews });

  } catch (error) { next(error) }
};

export {addReview, getReviews}