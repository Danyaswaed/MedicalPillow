import "./Admin.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

import ProductsAdmin from "./components/ProductsAdmin";
import CustomersAdmin from "./components/CustomersAdmin";
import MessagesAdmin from "./components/MessagesAdmin";
import ReportsAdmin from "./components/ReportsAdmin";
import ReviewsAdmin from "./components/ReviewsAdmin";
import SettingsAdmin from "./components/SettingsAdmin";
import {
  FaDollarSign,
  FaUsers,
  FaShoppingBag,
  FaStar,
  FaTruck,
  FaClipboardList,
  FaBoxOpen,
  FaCommentDots,
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaFileExcel,
  FaEye,
  FaSearch,
} from "react-icons/fa";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    const res = await api.get("/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setDashboard(res.data);
  };

  const fetchOrders = async () => {
    const res = await api.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAllOrders(res.data);
  };

  useEffect(() => {
    fetchDashboard();
    fetchOrders();

    api.get("/settings/delivery-price").then((res) => {
      setDeliveryPrice(res.data.delivery_price);
    });
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await fetchDashboard();
      await fetchOrders();

      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      console.log(err);
      alert("עדכון סטטוס ההזמנה נכשל");
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedOrder(res.data);
    } catch (err) {
      console.log(err);
      alert("טעינת פרטי ההזמנה נכשלה");
    }
  };

  const saveDeliveryPrice = async () => {
    await api.put(
      "/settings/delivery-price",
      { delivery_price: deliveryPrice },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    alert("מחיר המשלוח עודכן בהצלחה");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  const getFilteredOrders = (orders = []) => {
    return orders.filter((order) => {
      const searchText = orderSearch.toLowerCase();

      const matchesSearch =
        order.order_id.toString().includes(searchText) ||
        `${order.first_name} ${order.last_name}`
          .toLowerCase()
          .includes(searchText) ||
        order.phone?.toLowerCase().includes(searchText) ||
        order.email?.toLowerCase().includes(searchText);

      const matchesStatus =
        orderStatusFilter === "All" || order.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  };
  if (!dashboard) return <div className="loading">טוען נתונים...</div>;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Cervio</h2>

        <nav>
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome /> לוח ראשי
          </button>

          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag /> הזמנות
          </button>

          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            <FaBoxOpen /> מוצרים
          </button>

          <button
            className={activeTab === "customers" ? "active" : ""}
            onClick={() => setActiveTab("customers")}
          >
            <FaUsers /> לקוחות
          </button>

          <button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <FaCommentDots /> הודעות
          </button>

          <button
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            <FaFileExcel /> דוחות
          </button>

          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog /> הגדרות
          </button>
          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            <FaStar /> ביקורות
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> התנתקות
        </button>
      </aside>

      <section className="admin-page">
        <header className="dashboard-header">
          <div>
            <h1>לוח ניהול</h1>
            <p>ניהול הזמנות, לקוחות, מוצרים ודוחות של Cervio</p>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <>
            <section className="dashboard-cards">
              <div className="dashboard-card revenue">
                <FaDollarSign />
                <h2>₪ {dashboard.revenue}</h2>
                <span>סך הכנסות</span>
              </div>

              <div className="dashboard-card">
                <FaUsers />
                <h2>{dashboard.totalCustomers}</h2>
                <span>לקוחות</span>
              </div>

              <div className="dashboard-card">
                <FaShoppingBag />
                <h2>{dashboard.totalOrders}</h2>
                <span>הזמנות</span>
              </div>

              <div className="dashboard-card">
                <FaTruck />
                <h2>{dashboard.shipped}</h2>
                <span>במשלוח</span>
              </div>

              <div className="dashboard-card">
                <FaBoxOpen />
                <h2>{dashboard.preparing}</h2>
                <span>בהכנה</span>
              </div>

              <div className="dashboard-card">
                <FaStar />
                <h2>4.9</h2>
                <span>דירוג</span>
              </div>
            </section>

            <OrdersTable
              orders={dashboard.recentOrders}
              updateStatus={updateStatus}
              openOrderDetails={openOrderDetails}
              title="הזמנות אחרונות"
            />
          </>
        )}

        {activeTab === "orders" && (
          <OrdersTable
            orders={getFilteredOrders(allOrders)}
            updateStatus={updateStatus}
            openOrderDetails={openOrderDetails}
            title="כל ההזמנות"
            showFilters={true}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
          />
        )}

        {activeTab === "products" && <ProductsAdmin />}

        {activeTab === "customers" && <CustomersAdmin />}

        {activeTab === "messages" && <MessagesAdmin />}

        {activeTab === "reports" && <ReportsAdmin />}

        {activeTab === "settings" && <SettingsAdmin />}

        {activeTab === "reviews" && <ReviewsAdmin />}
      </section>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          updateStatus={updateStatus}
        />
      )}
    </main>
  );
}

function getStatusInfo(status) {
  const statuses = {
    Pending: {
      label: "התקבלה",
      className: "status-pending",
      rowClass: "row-pending",
    },
    Paid: {
      label: "התשלום אושר",
      className: "status-paid",
      rowClass: "row-paid",
    },
    Preparing: {
      label: "בהכנה",
      className: "status-preparing",
      rowClass: "row-preparing",
    },
    Shipped: {
      label: "במשלוח",
      className: "status-shipped",
      rowClass: "row-shipped",
    },
    Delivered: {
      label: "נמסרה",
      className: "status-delivered",
      rowClass: "row-delivered",
    },
    Cancelled: {
      label: "בוטלה",
      className: "status-cancelled",
      rowClass: "row-cancelled",
    },
  };

  return (
    statuses[status] || {
      label: status,
      className: "status-default",
      rowClass: "row-default",
    }
  );
}

function OrdersTable({
  orders = [],
  updateStatus,
  openOrderDetails,
  title,
  showFilters = false,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
}) {
  return (
    <section className="dashboard-section">
      <div className="section-title">
        <FaClipboardList />
        <h2>{title}</h2>
      </div>
      {showFilters && (
        <div className="orders-toolbar">
          <div className="orders-search">
            <FaSearch />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון, אימייל או מספר הזמנה"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
          </div>

          <div className="orders-filters">
            <button
              className={orderStatusFilter === "All" ? "active" : ""}
              onClick={() => setOrderStatusFilter("All")}
            >
              הכל
            </button>

            <button
              className={orderStatusFilter === "Pending" ? "active" : ""}
              onClick={() => setOrderStatusFilter("Pending")}
            >
              התקבלה
            </button>

            <button
              className={orderStatusFilter === "Paid" ? "active" : ""}
              onClick={() => setOrderStatusFilter("Paid")}
            >
              התשלום אושר
            </button>

            <button
              className={orderStatusFilter === "Preparing" ? "active" : ""}
              onClick={() => setOrderStatusFilter("Preparing")}
            >
              בהכנה
            </button>

            <button
              className={orderStatusFilter === "Shipped" ? "active" : ""}
              onClick={() => setOrderStatusFilter("Shipped")}
            >
              במשלוח
            </button>

            <button
              className={orderStatusFilter === "Delivered" ? "active" : ""}
              onClick={() => setOrderStatusFilter("Delivered")}
            >
              נמסרה
            </button>

            <button
              className={orderStatusFilter === "Cancelled" ? "active" : ""}
              onClick={() => setOrderStatusFilter("Cancelled")}
            >
              בוטלה
            </button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>מספר הזמנה</th>
            <th>לקוח</th>
            <th>טלפון</th>
            <th>סכום</th>
            <th>קבלה</th>
            <th>תשלום</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                אין הזמנות להצגה
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);

              return (
                <tr
                  key={order.order_id}
                  className={`order-row ${statusInfo.rowClass}`}
                >
                  <td>#{order.order_id}</td>

                  <td>
                    {order.first_name} {order.last_name}
                  </td>

                  <td>{order.phone}</td>

                  <td>₪ {order.total_price}</td>

                  <td>
                    {order.delivery_method === "delivery"
                      ? "משלוח"
                      : "איסוף עצמי"}
                  </td>

                  <td>{order.payment_method === "cash" ? "מזומן" : "ויזה"}</td>

                  <td>
                    <div className="status-cell">
                      <span
                        className={`order-status-pill ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.order_id, e.target.value)
                        }
                        className={`status-select ${statusInfo.className}`}
                      >
                        <option value="Pending">התקבלה</option>
                        <option value="Paid">התשלום אושר</option>
                        <option value="Preparing">בהכנה</option>
                        <option value="Shipped">במשלוח</option>
                        <option value="Delivered">נמסרה</option>
                        <option value="Cancelled">בוטלה</option>
                      </select>
                    </div>
                  </td>

                  <td>
                    <button
                      className="details-btn"
                      onClick={() => openOrderDetails(order.order_id)}
                    >
                      <FaEye />
                      פרטים
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}

function OrderDetailsModal({ order, onClose, updateStatus }) {
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="order-details-modal">
      <div className="order-details-card">
        <div className="order-details-header">
          <div>
            <h2>פרטי הזמנה #{order.order_id}</h2>
            <span className={`order-status-pill ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>

          <button onClick={onClose}>×</button>
        </div>

        <div className="order-details-grid">
          <div>
            <span>לקוח</span>
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
            <strong>
              {order.delivery_method === "delivery" ? "משלוח" : "איסוף עצמי"}
            </strong>
          </div>

          <div>
            <span>שיטת תשלום</span>
            <strong>
              {order.payment_method === "cash" ? "מזומן" : "ויזה"}
            </strong>
          </div>
        </div>

        <div className="order-status-update">
          <label>עדכון סטטוס</label>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order.order_id, e.target.value)}
            className={`status-select ${statusInfo.className}`}
          >
            <option value="Pending">התקבלה</option>
            <option value="Paid">התשלום אושר</option>
            <option value="Preparing">בהכנה</option>
            <option value="Shipped">במשלוח</option>
            <option value="Delivered">נמסרה</option>
            <option value="Cancelled">בוטלה</option>
          </select>
        </div>

        <h3>מוצרים בהזמנה</h3>

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
            {order.items?.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  אין מוצרים להצגה
                </td>
              </tr>
            ) : (
              order.items.map((item) => (
                <tr key={item.order_item_id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>₪ {item.price}</td>
                  <td>₪ {Number(item.price) * Number(item.quantity)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="order-total-box">
          <span>סה״כ הזמנה</span>
          <strong>₪ {order.total_price}</strong>
        </div>
      </div>
    </div>
  );
}

export default Admin;
