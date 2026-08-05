import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  FaStar,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaThumbtack,
} from "react-icons/fa";

function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);

  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    const res = await api.get("/reviews/admin/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReview = async (reviewId, data) => {
    await api.put(`/reviews/admin/${reviewId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchReviews();
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("למחוק את הביקורת?")) return;

    await api.delete(`/reviews/admin/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchReviews();
  };

  return (
    <section className="dashboard-section">
      <div className="section-title">
        <FaStar />
        <h2>ניהול ביקורות</h2>
      </div>

      {reviews.length === 0 ? (
        <p>אין ביקורות להצגה</p>
      ) : (
        <div className="admin-reviews-list">
          {reviews.map((review) => (
            <div className="admin-review-card" key={review.review_id}>
              <div className="admin-review-header">
                <div>
                  <h3>
                    {review.first_name} {review.last_name}
                  </h3>
                  <small>{review.email}</small>
                </div>

                <div className="admin-review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= review.rating ? "filled" : ""}
                    />
                  ))}
                </div>
              </div>

              <p>{review.comment}</p>

              <div className="review-admin-badges">
                <span
                  className={
                    review.is_approved === 1
                      ? "review-approved"
                      : "review-hidden"
                  }
                >
                  {review.is_approved === 1 ? "מוצגת באתר" : "מוסתרת"}
                </span>

                {review.is_featured === 1 && (
                  <span className="review-featured">ביקורת מומלצת</span>
                )}
              </div>

              <small>
                {new Date(review.review_date).toLocaleDateString("he-IL")}
              </small>

              <div className="review-admin-actions">
                <button
                  onClick={() =>
                    updateReview(review.review_id, {
                      is_approved: review.is_approved === 1 ? 0 : 1,
                      is_featured: review.is_featured,
                    })
                  }
                >
                  {review.is_approved === 1 ? <FaEyeSlash /> : <FaEye />}
                  {review.is_approved === 1 ? "הסתרה" : "הצגה"}
                </button>

                <button
                  onClick={() =>
                    updateReview(review.review_id, {
                      is_approved: review.is_approved,
                      is_featured: review.is_featured === 1 ? 0 : 1,
                    })
                  }
                >
                  <FaThumbtack />
                  {review.is_featured === 1 ? "הסרת מומלץ" : "הגדרה כמומלץ"}
                </button>

                <button
                  className="danger"
                  onClick={() => deleteReview(review.review_id)}
                >
                  <FaTrash />
                  מחיקה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReviewsAdmin;
