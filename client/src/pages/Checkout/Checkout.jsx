import "./Checkout.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaTruck, FaCreditCard } from "react-icons/fa";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
  });

  useEffect(() => {
    api.get("/settings/delivery-price").then((res) => {
      setDeliveryPrice(Number(res.data.delivery_price));
    });

    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser({
            first_name: res.data.first_name || "",
            last_name: res.data.last_name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            address: res.data.address || "",
            city: res.data.city || "",
            postal_code: res.data.postal_code || "",
          });
        })
        .catch(console.error);
    }
  }, []);

  const deliveryFee = deliveryMethod === "delivery" ? deliveryPrice : 0;
  const total = subtotal + deliveryFee;

  const handleUserChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("יש להתחבר לפני ביצוע הזמנה");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("הסל ריק");
      navigate("/cart");
      return;
    }

    try {
      await api.put("/profile", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderData = {
        total_price: total,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        delivery_address: user.address,
        city: user.city,
        postal_code: user.postal_code,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearCart();
      navigate(`/order-success?order=${res.data.order_id}`);
    } catch (err) {
      console.log(err);
      alert("אירעה שגיאה בביצוע ההזמנה");
    }
  };

  return (
    <main className="checkout-page">
      <h1>סיום הזמנה</h1>

      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-card">
            <h2>פרטים אישיים</h2>

            <div className="form-grid">
              <input
                name="first_name"
                type="text"
                placeholder="שם פרטי"
                value={user.first_name}
                onChange={handleUserChange}
                required
              />

              <input
                name="last_name"
                type="text"
                placeholder="שם משפחה"
                value={user.last_name}
                onChange={handleUserChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="אימייל"
                value={user.email}
                onChange={handleUserChange}
                required
              />

              <input
                name="phone"
                type="tel"
                placeholder="טלפון"
                value={user.phone}
                onChange={handleUserChange}
                required
              />
            </div>
          </div>

          <div className="form-card">
            <h2>שיטת קבלה</h2>

            <div className="delivery-options">
              <button
                type="button"
                className={
                  deliveryMethod === "delivery"
                    ? "delivery active-delivery"
                    : "delivery"
                }
                onClick={() => setDeliveryMethod("delivery")}
              >
                <FaTruck />
                משלוח עד הבית
              </button>

              <button
                type="button"
                className={
                  deliveryMethod === "pickup"
                    ? "delivery active-delivery"
                    : "delivery"
                }
                onClick={() => setDeliveryMethod("pickup")}
              >
                <FaHome />
                איסוף עצמי
              </button>
            </div>

            {deliveryMethod === "delivery" && (
              <div className="form-grid address-grid">
                <input
                  name="city"
                  type="text"
                  value={user.city}
                  onChange={handleUserChange}
                  placeholder="עיר"
                  required
                />

                <input
                  name="address"
                  type="text"
                  value={user.address}
                  onChange={handleUserChange}
                  placeholder="רחוב ומספר בית"
                  required
                />

                <input
                  name="postal_code"
                  type="text"
                  value={user.postal_code}
                  onChange={handleUserChange}
                  placeholder="מיקוד"
                />

                <input type="text" placeholder="הערות לשליח" />
              </div>
            )}

            {deliveryMethod === "pickup" && (
              <div className="pickup-box">
                ניתן לאסוף את ההזמנה מהקליניקה בתיאום מראש לאחר אישור ההזמנה.
              </div>
            )}
          </div>

          <div className="form-card">
            <h2>תשלום</h2>

            <div className="payment-options">
              <button
                type="button"
                className={
                  paymentMethod === "cash"
                    ? "payment active-payment"
                    : "payment"
                }
                onClick={() => setPaymentMethod("cash")}
              >
                מזומן
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "visa"
                    ? "payment active-payment"
                    : "payment"
                }
                onClick={() => setPaymentMethod("visa")}
              >
                ויזה
              </button>
            </div>

            <div className="payment-box">
              <FaCreditCard />
              <span>
                {paymentMethod === "cash"
                  ? "תשלום במזומן בעת קבלה / איסוף"
                  : "תשלום מאובטח בכרטיס אשראי"}
              </span>
            </div>

            <button className="pay-btn" type="submit">
              אישור הזמנה
            </button>
          </div>
        </form>

        <aside className="checkout-summary">
          <h2>סיכום הזמנה</h2>

          {cartItems.map((item) => (
            <div className="summary-row" key={item.product_id}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>₪{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}

          <div className="summary-row">
            <span>משלוח</span>
            <strong>₪{deliveryFee.toFixed(2)}</strong>
          </div>

          <div className="summary-total">
            <span>סה״כ לתשלום</span>
            <strong>₪{total.toFixed(2)}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Checkout;
