import "./Profile.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaLock, FaTruck, FaReceipt } from "react-icons/fa";
import api from "../../services/api";

function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          city: res.data.city || "",
          postal_code: res.data.postal_code || "",
        });
      })
      .catch(() => navigate("/login"));

    api
      .get("/profile/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, [navigate]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    await api.put("/profile", profile, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("הפרטים עודכנו בהצלחה");
  };

  const translateStatus = (status) => {
    const statuses = {
      Pending: "התקבלה",
      Paid: "התשלום אושר",
      Preparing: "בהכנה",
      Shipped: "במשלוח",
      Delivered: "נמסרה",
      Cancelled: "בוטלה",
    };

    return statuses[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      Pending: "pending",
      Paid: "paid",
      Preparing: "preparing",
      Shipped: "shipped",
      Delivered: "delivered",
      Cancelled: "cancelled",
    };

    return classes[status] || "pending";
  };

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div>
          <h1>שלום, {profile.first_name || "לקוח"}</h1>
          <p>כאן אפשר לנהל את הפרטים וההזמנות שלך.</p>
        </div>
      </section>

      <section className="profile-layout">
        <aside className="profile-menu">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> פרטים אישיים
          </button>

          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <FaBox /> ההזמנות שלי
          </button>

          <button
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            <FaLock /> שינוי סיסמה
          </button>
        </aside>

        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-card">
              <h2>פרטים אישיים</h2>

              <div className="profile-grid">
                <input
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleProfileChange}
                  placeholder="שם פרטי"
                />

                <input
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleProfileChange}
                  placeholder="שם משפחה"
                />

                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="אימייל"
                />

                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="טלפון"
                />

                <input
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  placeholder="כתובת"
                />

                <input
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                  placeholder="עיר"
                />

                <input
                  name="postal_code"
                  value={profile.postal_code}
                  onChange={handleProfileChange}
                  placeholder="מיקוד"
                />
              </div>

              <button className="save-btn" onClick={saveProfile}>
                שמירת פרטים
              </button>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="profile-card">
              <h2>ההזמנות שלי</h2>

              {orders.length === 0 ? (
                <p className="empty-text">אין עדיין הזמנות.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div className="order-card" key={order.order_id}>
                      <div>
                        <h3>הזמנה #{order.order_id}</h3>
                        <p>
                          {new Date(order.order_date).toLocaleDateString(
                            "he-IL",
                          )}
                        </p>
                      </div>

                      <strong>₪{Number(order.total_price).toFixed(2)}</strong>

                      <span
                        className={`order-status ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {translateStatus(order.status)}
                      </span>

                      <div className="profile-order-actions">
                        <Link
                          to={`/track-order?order=${order.order_id}`}
                          className="profile-order-btn"
                        >
                          <FaTruck /> מעקב הזמנה
                        </Link>

                        <Link
                          to={`/receipt?order=${order.order_id}`}
                          className="profile-order-btn secondary"
                        >
                          <FaReceipt /> צפייה בקבלה
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "password" && (
            <div className="profile-card">
              <h2>שינוי סיסמה</h2>
              <PasswordForm />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function PasswordForm() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const changePassword = async () => {
    await api.put("/profile/password", passwords, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("הסיסמה עודכנה בהצלחה");
    setPasswords({ currentPassword: "", newPassword: "" });
  };

  return (
    <div className="password-form">
      <input
        type="password"
        placeholder="סיסמה נוכחית"
        value={passwords.currentPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, currentPassword: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="סיסמה חדשה"
        value={passwords.newPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, newPassword: e.target.value })
        }
      />

      <button className="save-btn" onClick={changePassword}>
        עדכון סיסמה
      </button>
    </div>
  );
}

export default Profile;
