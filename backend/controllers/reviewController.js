import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";

const addReview = async (req, res, next) => {

    try {
        const {productId, rating, comment} = req.body;

         console.log('productId:', productId)
        console.log('rating:', rating)
        console.log('comment:', comment)
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

        // 201 Created — review nou adăugat
        res.status(201).json({ success: true, message: "Review Added" })
      } catch (error) {

        if (error.code === 11000) {
          // 409 Conflict — userul a mai lăsat deja un review pentru acest produs
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
      .populate('userId', 'name')  // joins User collection, fetches only 'name'
      .sort({createdAt: -1})  // newest reviews first (bonus improvement)

    res.status(200).json({ success: true, reviews });

  } catch (error) { next(error) }
};

export {addReview, getReviews}