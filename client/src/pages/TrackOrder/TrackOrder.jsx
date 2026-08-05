import "./TrackOrder.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";

function TrackOrder() {
  const [params] = useSearchParams();
  const orderId = params.get("order");

  const [tracking, setTracking] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    api
      .get(`/orders/${orderId}/tracking`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOrderInfo(res.data);
        setTracking(res.data.tracking || []);
      })
      .catch(console.error);
  }, [orderId]);

  return (
    <main className="tracking-page">
      <h1>מעקב הזמנה</h1>

      <div className="tracking-card">
        <h2>הזמנה #{orderInfo?.order_id || orderId}</h2>

        {tracking.map((item, index) => (
          <div className="tracking-item" key={index}>
            <div className="tracking-dot"></div>

            <div>
              <h3>{item.status}</h3>
              <p>{item.notes}</p>
              <span>{new Date(item.updated_at).toLocaleString("he-IL")}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default TrackOrder;
