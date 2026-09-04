import "./Checkout.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTruck,
  FaCreditCard,
  FaPaypal,
  FaMoneyBillWave,
} from "react-icons/fa";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import PayPalCheckout from "../../components/PayPalCheckout/PayPalCheckout";

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
  const hasRequiredCheckoutDetails =
    user.first_name.trim() &&
    user.last_name.trim() &&
    user.email.trim() &&
    user.phone.trim() &&
    (deliveryMethod === "pickup" ||
      (user.address.trim() && user.city.trim()));

  const handleUserChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePaypalOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("יש להתחבר לפני ביצוע הזמנה");
      navigate("/login");
      throw new Error("User is not logged in");
    }

    if (cartItems.length === 0) {
      alert("הסל ריק");
      navigate("/cart");
      throw new Error("Cart is empty");
    }

    if (
      !user.first_name.trim() ||
      !user.last_name.trim() ||
      !user.email.trim() ||
      !user.phone.trim()
    ) {
      alert("יש למלא את כל הפרטים האישיים");
      throw new Error("Personal details are missing");
    }

    if (
      deliveryMethod === "delivery" &&
      (!user.address.trim() || !user.city.trim())
    ) {
      alert("יש למלא עיר וכתובת למשלוח");
      throw new Error("Delivery address is missing");
    }

    try {
      await api.put("/profile", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderData = {
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === "delivery" ? user.address : null,
        city: deliveryMethod === "delivery" ? user.city : null,
        postal_code: deliveryMethod === "delivery" ? user.postal_code : null,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders/paypal/create", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.orderId) {
        throw new Error("PayPal order ID is missing");
      }

      return {
        orderId: response.data.orderId,
      };
    } catch (error) {
      console.error("PayPal create error:", error);
      console.log("Request URL:", error.config?.url);
      console.log("Status:", error.response?.status);
      console.log("Response data:", error.response?.data);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        throw error;
      }

      alert(
        error.response?.data?.message || "אירעה שגיאה בהתחלת התשלום ב-PayPal",
      );

      throw error;
    }
  };

  const handlePaypalError = () => {
    alert("PayPal אינו זמין כרגע. יש לבדוק את הגדרות התשלום ולנסות שוב.");
  };

  const handleApprovePaypal = async ({ orderId }) => {
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(
        `/orders/paypal/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.paid) {
        throw new Error("Payment was not completed");
      }

      clearCart();

      navigate(`/order-success?order=${response.data.order_id}`);
    } catch (error) {
      console.error("PayPal capture error:", error);
      alert("התשלום לא הושלם. לא חויבת בהזמנה חדשה.");
    }
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
    if (paymentMethod === "paypal") {
      return;
    }

    if (paymentMethod === "visa") {
      alert("תשלום בכרטיס אשראי יחובר בשלב הבא");
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

          <div className="form-card payment-card">
            <div className="payment-heading">
              <div>
                <span className="section-label">תשלום מאובטח</span>
                <h2>בחירת אמצעי תשלום</h2>
              </div>

              <FaCreditCard className="payment-heading-icon" />
            </div>

            <div className="payment-options">
              <button
                type="button"
                className={
                  paymentMethod === "visa"
                    ? "payment active-payment"
                    : "payment"
                }
                onClick={() => setPaymentMethod("visa")}
              >
                <span className="payment-icon credit-icon">
                  <FaCreditCard />
                </span>

                <span className="payment-text">
                  <strong>כרטיס אשראי</strong>
                  <small>Visa / Mastercard</small>
                </span>

                <span className="payment-radio">
                  <span />
                </span>
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "paypal"
                    ? "payment active-payment"
                    : "payment"
                }
                onClick={() => setPaymentMethod("paypal")}
              >
                <span className="payment-icon paypal-icon">
                  <FaPaypal />
                </span>

                <span className="payment-text">
                  <strong>PayPal</strong>
                  <small>תשלום דרך חשבון PayPal</small>
                </span>

                <span className="payment-radio">
                  <span />
                </span>
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "cash"
                    ? "payment active-payment"
                    : "payment"
                }
                onClick={() => setPaymentMethod("cash")}
              >
                <span className="payment-icon cash-icon">
                  <FaMoneyBillWave />
                </span>

                <span className="payment-text">
                  <strong>מזומן</strong>
                  <small>תשלום בעת קבלה או איסוף</small>
                </span>

                <span className="payment-radio">
                  <span />
                </span>
              </button>
            </div>

            <div className={`payment-box ${paymentMethod}`}>
              {paymentMethod === "cash" && (
                <>
                  <FaMoneyBillWave />
                  <span>
                    התשלום יתבצע במזומן בעת קבלת ההזמנה או באיסוף עצמי.
                  </span>
                </>
              )}

              {paymentMethod === "visa" && (
                <>
                  <FaCreditCard />
                  <span>תועברי לעמוד מאובטח לתשלום באמצעות כרטיס אשראי.</span>
                </>
              )}

              {paymentMethod === "paypal" && (
                <>
                  <FaPaypal />
                  <span>לאחר אישור הפרטים יופיע כפתור PayPal המאובטח.</span>
                </>
              )}
            </div>

            <div className="secure-payment-note">
              <span>🔒</span>
              פרטי התשלום שלך מאובטחים ואינם נשמרים באתר
            </div>

            {paymentMethod === "paypal" ? (
              <div className="paypal-checkout-container">
                {hasRequiredCheckoutDetails ? (
                  <PayPalCheckout
                    createOrder={handleCreatePaypalOrder}
                    onApprove={handleApprovePaypal}
                    onError={handlePaypalError}
                  />
                ) : (
                  <div className="paypal-validation-message">
                    יש למלא את הפרטים האישיים ופרטי המשלוח לפני תשלום ב-PayPal.
                  </div>
                )}
              </div>
            ) : (
              <button className="pay-btn" type="submit">
                {paymentMethod === "cash" && "אישור הזמנה"}

                {paymentMethod === "visa" && `מעבר לתשלום ₪${total.toFixed(2)}`}
              </button>
            )}
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
