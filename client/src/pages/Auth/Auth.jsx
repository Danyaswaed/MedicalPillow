import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import api from "../../services/api";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post("/users/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        await api.post("/users/register", form);
        alert("ההרשמה בוצעה בהצלחה");
        setIsLogin(true);
      }
    } catch (err) {
      alert("אירעה שגיאה, בדקו את הפרטים ונסו שוב");
      console.log(err);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>{isLogin ? "התחברות" : "הרשמה"}</h1>
          <p>
            {isLogin
              ? "התחברו לחשבון שלכם כדי לעקוב אחרי הזמנות."
              : "צרו חשבון חדש להזמנה מהירה ונוחה."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-box">
                <FaUser />
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="שם פרטי"
                  required
                />
              </div>

              <div className="input-box">
                <FaUser />
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="שם משפחה"
                  required
                />
              </div>

              <div className="input-box">
                <FaPhone />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="טלפון"
                  required
                />
              </div>
            </>
          )}

          <div className="input-box">
            <FaEnvelope />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="אימייל"
              required
            />
          </div>

          <div className="input-box">
            <FaLock />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="סיסמה"
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            {isLogin ? "התחברות" : "הרשמה"}
          </button>
        </form>

        <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "אין לכם חשבון? הרשמה" : "כבר יש לכם חשבון? התחברות"}
        </button>
      </section>
    </main>
  );
}

export default Auth;
