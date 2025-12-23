import express from 'express';
import { createReview, deleteReview, getReviews, updateReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("",getReviews);
reviewRouter.delete("/:id",deleteReview);
reviewRouter.put("/:id", updateReview);


export default reviewRouter;