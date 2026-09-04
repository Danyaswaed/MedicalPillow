import "./Receipt.css";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../services/api";

function Receipt() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    api
      .get(`/orders/${orderId}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setOrder(res.data))
      .catch((err) => {
        console.log(err);
        alert("טעינת הקבלה נכשלה");
      });
  }, [orderId]);

  const translateDelivery = (value) =>
    value === "delivery" ? "משלוח" : "איסוף עצמי";

  const translatePayment = (value) => (value === "cash" ? "מזומן" : "ויזה");

  const translateStatus = (value) => {
    const statuses = {
      Pending: "התקבלה",
      Paid: "התשלום אושר",
      Preparing: "בהכנה",
      Shipped: "במשלוח",
      Delivered: "נמסרה",
      Cancelled: "בוטלה",
    };

    return statuses[value] || value;
  };

  if (!order) {
    return <main className="receipt-page">טוען קבלה...</main>;
  }

  return (
    <main className="receipt-page">
      <div className="receipt-actions no-print">
        <Link to="/profile">חזרה לפרופיל</Link>
        <button onClick={() => window.print()}>הדפסה / שמירה כ-PDF</button>
      </div>

      <section className="receipt-card">
        <header className="receipt-header">
          <div>
            <h1>Cervica</h1>
            <p>קבלה עבור הזמנה #{order.order_id}</p>
          </div>

          <div className="receipt-meta">
            <span>תאריך</span>
            <strong>
              {new Date(order.order_date).toLocaleDateString("he-IL")}
            </strong>
          </div>
        </header>

        <div className="receipt-status">
          <span>סטטוס הזמנה</span>
          <strong>{translateStatus(order.status)}</strong>
        </div>

        <section className="receipt-grid">
          <div>
            <span>שם לקוח</span>
            <strong>
              {order.first_name} {order.last_name}
            </strong>
          </div>

          <div>
            <span>טלפון</span>
            <strong>{order.phone}</strong>
          </div>

          <div>
            <span>אימייל</span>
            <strong>{order.email}</strong>
          </div>

          <div>
            <span>עיר</span>
            <strong>{order.city || "-"}</strong>
          </div>

          <div>
            <span>כתובת</span>
            <strong>{order.delivery_address || "-"}</strong>
          </div>

          <div>
            <span>מיקוד</span>
            <strong>{order.postal_code || "-"}</strong>
          </div>

          <div>
            <span>שיטת קבלה</span>
            <strong>{translateDelivery(order.delivery_method)}</strong>
          </div>

          <div>
            <span>שיטת תשלום</span>
            <strong>{translatePayment(order.payment_method)}</strong>
          </div>
        </section>

        <section className="receipt-items">
          <h2>מוצרים בהזמנה</h2>

          <table>
            <thead>
              <tr>
                <th>מוצר</th>
                <th>כמות</th>
                <th>מחיר</th>
                <th>סה״כ</th>
              </tr>
            </thead>

            <tbody>
              {order.items?.map((item) => (
                <tr key={item.order_item_id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>₪ {item.price}</td>
                  <td>₪ {Number(item.price) * Number(item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="receipt-total">
          <span>סה״כ לתשלום</span>
          <strong>₪ {order.total_price}</strong>
        </footer>

        <p className="receipt-note">
          תודה שבחרתם Cervica. הקבלה נוצרה באופן אוטומטי ממערכת ההזמנות.
        </p>
      </section>
    </main>
  );
}

export default Receipt;
