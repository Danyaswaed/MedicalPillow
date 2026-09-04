import "./Reviews.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaStar } from "react-icons/fa";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    const res = await api.get("/reviews");
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("יש להתחבר כדי לכתוב ביקורת");
      window.location.href = "/login";
      return;
    }

    if (!comment.trim()) {
      alert("יש לכתוב ביקורת");
      return;
    }

    try {
      await api.post(
        "/reviews",
        {
          product_id: 1,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("הביקורת נשלחה בהצלחה");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.log(err);
      alert("שליחת הביקורת נכשלה");
    }
  };

  return (
    <main className="reviews-page">
      <section className="reviews-hero">
        <span>לקוחות Cervica</span>
        <h1>ביקורות וחוויות</h1>
        <p>כאן תוכלו לקרוא מה לקוחות חושבים על הכרית, ולשתף את החוויה שלכם.</p>
      </section>

      <section className="reviews-layout">
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="empty-reviews">
              <h2>עדיין אין ביקורות</h2>
              <p>היו הראשונים לכתוב ביקורת על Cervica.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div className="review-card" key={review.review_id}>
                <div className="review-top">
                  <div>
                    <h3>
                      {review.first_name} {review.last_name}
                    </h3>

                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= review.rating ? "filled" : ""}
                        />
                      ))}
                    </div>
                  </div>

                  {review.is_featured === 1 && (
                    <span className="featured-badge">מומלץ</span>
                  )}
                </div>

                <p>{review.comment}</p>

                <small>
                  {new Date(review.review_date).toLocaleDateString("he-IL")}
                </small>
              </div>
            ))
          )}
        </div>

        <form className="review-form" onSubmit={submitReview}>
          <h2>כתיבת ביקורת</h2>

          <label>דירוג</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 כוכבים</option>
            <option value="4">4 כוכבים</option>
            <option value="3">3 כוכבים</option>
            <option value="2">2 כוכבים</option>
            <option value="1">1 כוכב</option>
          </select>

          <label>הביקורת שלך</label>
          <textarea
            placeholder="כתבו כאן את החוויה שלכם..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit">שליחת ביקורת</button>
        </form>
      </section>
    </main>
  );
}

export default Reviews;
