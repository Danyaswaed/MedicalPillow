import { useState } from "react";
import api from "../../../services/api";
import { FaFileExcel, FaShoppingBag, FaDollarSign } from "react-icons/fa";

function ReportsAdmin() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  const token = localStorage.getItem("token");

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

  const fetchReport = async () => {
    const res = await api.get(
      `/admin/reports/monthly?month=${month}&year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setReport(res.data.orders || []);
    setSummary(res.data.summary || { totalOrders: 0, totalRevenue: 0 });
  };

  const downloadExcel = async () => {
    const res = await api.get(
      `/admin/reports/monthly/download?month=${month}&year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      },
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `דוח-הזמנות-${month}-${year}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="dashboard-section">
      <div className="section-title">
        <FaFileExcel />
        <h2>דוחות חודשיים</h2>
      </div>

      <div className="settings-row">
        <label>חודש</label>
        <input
          type="number"
          min="1"
          max="12"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <label>שנה</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <button onClick={fetchReport}>הצגת דוח</button>
        <button onClick={downloadExcel}>הורדת Excel</button>
      </div>

      <div className="report-summary">
        <div>
          <FaShoppingBag />
          <span>סה״כ הזמנות</span>
          <strong>{summary.totalOrders}</strong>
        </div>

        <div>
          <FaDollarSign />
          <span>סה״כ הכנסות</span>
          <strong>₪ {summary.totalRevenue}</strong>
        </div>
      </div>

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
            <th>תאריך</th>
          </tr>
        </thead>

        <tbody>
          {report.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                אין נתונים להצגה
              </td>
            </tr>
          ) : (
            report.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>
                  {order.first_name} {order.last_name}
                </td>
                <td>{order.phone}</td>
                <td>₪ {order.total_price}</td>
                <td>{translateDelivery(order.delivery_method)}</td>
                <td>{translatePayment(order.payment_method)}</td>
                <td>{translateStatus(order.status)}</td>
                <td>
                  {new Date(order.order_date).toLocaleDateString("he-IL")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default ReportsAdmin;
