const express = require("express");
const router = express.Router();

const verifyToken = require("../Middleware/verifyToken");
const isAdmin = require("../Middleware/auth");

const {
  getReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getReviews);

router.post("/", verifyToken, createReview);

router.get("/admin/all", verifyToken, isAdmin, getAllReviewsAdmin);

router.put("/admin/:id", verifyToken, isAdmin, updateReviewStatus);

router.delete("/admin/:id", verifyToken, isAdmin, deleteReview);

module.exports = router;
