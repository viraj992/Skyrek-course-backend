import Review from "../models/review.js";
import { isAdmin } from "./userController.js";

export async function createReview(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Please login to create review" });
    }

    const { rating, comment } = req.body;

    if (!rating || !comment) {
        return res.status(400).json({ message: "Rating and comment are required" });
    }

    try {
        const review = new Review({
            reviewerName: `${req.user.firstName} ${req.user.lastName}`,
            rating,
            comment
        });

        await review.save();

        res.status(201).json({
            message: "Review added successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add review"
        });
    }
}

export async function getReviews(req, res) {
    try {
        if (isAdmin(req)) {
            // Admin sees all reviews
            const reviews = await Review.find().sort({ createdAt: -1 });
            return res.json(reviews);
        } else {
            // Users see only approved reviews
            const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
            return res.json(reviews);
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Failed to fetch reviews" });
    }
}

export async function deleteReview(req,res){
    if(!isAdmin(req)){
        res.status(403).json({ message: "Access denied. Admins only"});
        return;
    }

    try {
        const reviewId = req.params.id;
                                                //_id is the unique MongoDB ID
        const result = await Review.deleteOne({ _id: reviewId }); 

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Failed to delete review" });
    }
}

export async function updateReview(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Please login to update review" });
    }

    const reviewId = req.params.id;
    const { rating, comment, isApproved } = req.body; // Added isApproved

    if (!rating || !comment) {
        return res.status(400).json({ message: "Rating and comment are required" });
    }

    try {
        // Step 1: Find existing review
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Step 2: Check admin OR owner
        const reviewerFullName = `${req.user.firstName} ${req.user.lastName}`;
        const isAdmin = req.user.role === "admin";

        if (!isAdmin && review.reviewerName !== reviewerFullName) {
            return res.status(403).json({
                message: "You can update only your own review"
            });
        }

        // Step 3: Update fields
        review.rating = rating;
        review.comment = comment;

        if (isAdmin) {
            // Admin can update approval status
            if (typeof isApproved === "boolean") {
                review.isApproved = isApproved;
            }
        } else {
            // Normal user updating → review requires reapproval
            review.isApproved = false;
        }

        await review.save();

        res.json({ message: "Review updated successfully" });

    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Failed to update review" });
    }
}

