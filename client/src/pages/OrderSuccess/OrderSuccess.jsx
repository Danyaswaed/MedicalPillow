import "./OrderSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaFileInvoice, FaHome, FaTruck } from "react-icons/fa";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className="success-page">
      <section className="success-card">
        <FaCheckCircle className="success-icon" />

        <h1>ההזמנה התקבלה בהצלחה</h1>

        <p>
          תודה שבחרתם ב־Cervio. ההזמנה שלכם נקלטה במערכת ותוכלו לעקוב אחרי
          הסטטוס שלה בכל רגע.
        </p>

        <div className="order-number">
          מספר הזמנה: <strong>#{orderId || "—"}</strong>
        </div>

        <div className="success-actions">
          <Link to={`/track-order?order=${orderId}`}>
            <FaTruck /> מעקב הזמנה
          </Link>

          <Link to="/">
            <FaHome /> חזרה לדף הבית
          </Link>

          <Link to={`/receipt?order=${orderId}`} className="success-btn">
            צפייה בקבלה
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;
