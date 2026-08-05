import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  FaCommentDots,
  FaTrash,
  FaEnvelopeOpen,
  FaReply,
} from "react-icons/fa";

function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMessages = () => {
    api
      .get("/admin/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    await api.put(
      `/admin/messages/${id}`,
      { status: "Read" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("למחוק את ההודעה?")) return;

    await api.delete(`/admin/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchMessages();
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      alert("יש לכתוב תגובה לפני השליחה");
      return;
    }

    try {
      await api.post(
        `/admin/messages/${selectedMessage.message_id}/reply`,
        {
          subject: `תגובה: ${selectedMessage.subject}`,
          message: replyMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("התגובה נשלחה בהצלחה");

      setReplyMessage("");
      setSelectedMessage(null);

      fetchMessages();
    } catch (err) {
      console.log(err);
      alert("שליחת התגובה נכשלה");
    }
  };

  const translateStatus = (status) => {
    const statuses = {
      Unread: "חדשה",
      Read: "נקראה",
      Answered: "נענתה",
    };

    return statuses[status] || status;
  };

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <section className="dashboard-section">
      <div className="section-title">
        <FaCommentDots />

        <h2>
          הודעות{" "}
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </h2>
      </div>

      {messages.length === 0 ? (
        <p>אין הודעות להצגה</p>
      ) : (
        messages.map((msg) => (
          <div
            className={`message-card ${
              msg.status === "Unread" ? "unread" : ""
            }`}
            key={msg.message_id}
          >
            <div className="message-header">
              <div>
                <h3>{msg.name}</h3>
                <small>{msg.email}</small>
              </div>

              <span className={`status ${msg.status.toLowerCase()}`}>
                {translateStatus(msg.status)}
              </span>
            </div>

            <h4>{msg.subject || "ללא נושא"}</h4>

            <p>{msg.message}</p>

            <div className="message-actions">
              <button onClick={() => markAsRead(msg.message_id)}>
                <FaEnvelopeOpen />
                סמן כנקראה
              </button>

              <button
                onClick={() => {
                  setSelectedMessage(msg);
                  setReplyMessage("");
                }}
              >
                <FaReply />
                תגובה
              </button>

              <button
                className="danger"
                onClick={() => deleteMessage(msg.message_id)}
              >
                <FaTrash />
                מחיקה
              </button>
            </div>
          </div>
        ))
      )}

      {selectedMessage && (
        <div className="reply-modal">
          <div className="reply-box">
            <h3>תגובה אל {selectedMessage.name}</h3>

            <p>{selectedMessage.email}</p>

            <textarea
              placeholder="כתבו כאן את התגובה..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />

            <div className="reply-buttons">
              <button onClick={sendReply}>שליחת תגובה</button>

              <button
                className="danger"
                onClick={() => setSelectedMessage(null)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MessagesAdmin;
