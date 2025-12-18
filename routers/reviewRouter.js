import express from 'express';
import { createReview, deleteReview, getReviews } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("",getReviews);
reviewRouter.delete("/:id",deleteReview);

export default reviewRouter;