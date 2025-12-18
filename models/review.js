import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewerName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Review = mongoose.model("reviews", reviewSchema);
export default Review;
