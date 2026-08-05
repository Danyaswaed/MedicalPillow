const Review = require("../models/Review");

const getReviews = (req, res) => {
  Review.getApprovedReviews((err, reviews) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get reviews",
        error: err,
      });
    }

    res.json(reviews);
  });
};

const createReview = (req, res) => {
  const user_id = req.user.user_id;
  const { product_id, rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      message: "Rating and comment are required",
    });
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  Review.createReview(
    {
      user_id,
      product_id: product_id || 1,
      rating,
      comment,
    },
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to create review",
          error: err,
        });
      }

      res.status(201).json({
        message: "Review created successfully",
      });
    },
  );
};

const getAllReviewsAdmin = (req, res) => {
  Review.getAllReviewsAdmin((err, reviews) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get admin reviews",
        error: err,
      });
    }

    res.json(reviews);
  });
};

const updateReviewStatus = (req, res) => {
  const reviewId = req.params.id;
  const { is_approved, is_featured } = req.body;

  Review.updateReviewStatus(
    reviewId,
    {
      is_approved,
      is_featured,
    },
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update review",
          error: err,
        });
      }

      res.json({
        message: "Review updated successfully",
      });
    },
  );
};

const deleteReview = (req, res) => {
  const reviewId = req.params.id;

  Review.deleteReview(reviewId, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete review",
        error: err,
      });
    }

    res.json({
      message: "Review deleted successfully",
    });
  });
};

module.exports = {
  getReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
};
