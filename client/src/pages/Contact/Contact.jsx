import "./Contact.css";
import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    await api.post("/contact", form);

    alert("ההודעה נשלחה בהצלחה");

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">
      <section className="contact-card">
        <div className="contact-info">
          <span>צור קשר</span>
          <h1>נשמח לעזור לכם</h1>
          <p>
            יש לכם שאלה על כרית Cervica, משלוח או איסוף עצמי? השאירו פרטים
            ונחזור אליכם בהקדם.
          </p>

          <div className="contact-line">
            <FaPhone />
            <strong>052-241-8085</strong>
          </div>

          <div className="contact-line">
            <FaEnvelope />
            <strong>Adnan3@bezeqin.net</strong>
          </div>

          <div className="contact-line">
            <FaMapMarkerAlt />
            <strong>קליניקה בתיאום מראש</strong>
          </div>
        </div>

        <form className="contact-form" onSubmit={sendMessage}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="שם מלא"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="אימייל"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="טלפון"
          />
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="נושא"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="הודעה"
            required
          />

          <button type="submit">שליחת הודעה</button>
        </form>
      </section>
    </main>
  );
}

export default Contact;
