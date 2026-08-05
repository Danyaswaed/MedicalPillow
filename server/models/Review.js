const db = require("../config/db");

const getApprovedReviews = (callback) => {
  const sql = `
    SELECT 
      reviews.review_id,
      reviews.rating,
      reviews.comment,
      reviews.review_date,
      reviews.is_featured,
      users.first_name,
      users.last_name
    FROM reviews
    JOIN users ON reviews.user_id = users.user_id
    WHERE reviews.is_deleted = 0
      AND reviews.is_approved = 1
    ORDER BY reviews.is_featured DESC, reviews.review_date DESC
  `;

  db.query(sql, callback);
};

const createReview = (review, callback) => {
  const sql = `
    INSERT INTO reviews
    (user_id, product_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [review.user_id, review.product_id, review.rating, review.comment],
    callback,
  );
};

const getAllReviewsAdmin = (callback) => {
  const sql = `
    SELECT 
      reviews.review_id,
      reviews.rating,
      reviews.comment,
      reviews.review_date,
      reviews.is_approved,
      reviews.is_featured,
      reviews.is_deleted,
      users.first_name,
      users.last_name,
      users.email
    FROM reviews
    JOIN users ON reviews.user_id = users.user_id
    WHERE reviews.is_deleted = 0
    ORDER BY reviews.review_date DESC
  `;

  db.query(sql, callback);
};

const updateReviewStatus = (review_id, data, callback) => {
  const sql = `
    UPDATE reviews
    SET is_approved = ?, is_featured = ?
    WHERE review_id = ?
  `;

  db.query(sql, [data.is_approved, data.is_featured, review_id], callback);
};

const deleteReview = (review_id, callback) => {
  const sql = `
    UPDATE reviews
    SET is_deleted = 1
    WHERE review_id = ?
  `;

  db.query(sql, [review_id], callback);
};

module.exports = {
  getApprovedReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
};
