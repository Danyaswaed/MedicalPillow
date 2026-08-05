import { useEffect, useState } from "react";
import api from "../../../services/api";
import { FaUsers } from "react-icons/fa";

function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api
      .get("/admin/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setCustomers(res.data))
      .catch(console.error);
  }, []);

  return (
    <section className="dashboard-section">
      <div className="section-title">
        <FaUsers />
        <h2>לקוחות</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>מספר לקוח</th>
            <th>שם מלא</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>עיר</th>
            <th>תאריך הצטרפות</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                אין לקוחות להצגה
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.user_id}>
                <td>#{customer.user_id}</td>

                <td>
                  {customer.first_name} {customer.last_name}
                </td>

                <td>{customer.email}</td>

                <td>{customer.phone}</td>

                <td>{customer.city || "-"}</td>

                <td>
                  {new Date(customer.created_at).toLocaleDateString("he-IL")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default CustomersAdmin;
