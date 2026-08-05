import { useEffect, useState } from "react";
import api from "../../../services/api";
import { FaCog } from "react-icons/fa";

function SettingsAdmin() {
  const [settings, setSettings] = useState({
    delivery_price: "",
    site_phone: "",
    site_email: "",
    site_whatsapp: "",
    site_address: "",
    site_instagram: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/settings/site")
      .then((res) => {
        setSettings({
          delivery_price: res.data.delivery_price || "",
          site_phone: res.data.site_phone || "",
          site_email: res.data.site_email || "",
          site_whatsapp: res.data.site_whatsapp || "",
          site_address: res.data.site_address || "",
          site_instagram: res.data.site_instagram || "",
        });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    try {
      await api.put("/settings/site", settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("ההגדרות נשמרו בהצלחה");
    } catch (err) {
      console.log(err);
      alert("שמירת ההגדרות נכשלה");
    }
  };

  return (
    <section className="dashboard-section">
      <div className="section-title">
        <FaCog />
        <h2>הגדרות אתר</h2>
      </div>

      <div className="admin-settings-grid">
        <div className="admin-setting-field">
          <label>מחיר משלוח</label>
          <input
            type="number"
            name="delivery_price"
            value={settings.delivery_price}
            onChange={handleChange}
          />
        </div>

        <div className="admin-setting-field">
          <label>טלפון</label>
          <input
            name="site_phone"
            value={settings.site_phone}
            onChange={handleChange}
          />
        </div>

        <div className="admin-setting-field">
          <label>אימייל</label>
          <input
            type="email"
            name="site_email"
            value={settings.site_email}
            onChange={handleChange}
          />
        </div>

        <div className="admin-setting-field">
          <label>וואטסאפ</label>
          <input
            name="site_whatsapp"
            value={settings.site_whatsapp}
            onChange={handleChange}
          />
        </div>

        <div className="admin-setting-field full">
          <label>כתובת</label>
          <input
            name="site_address"
            value={settings.site_address}
            onChange={handleChange}
          />
        </div>

        <div className="admin-setting-field full">
          <label>אינסטגרם</label>
          <input
            name="site_instagram"
            value={settings.site_instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>
      </div>

      <button className="save-settings-btn" onClick={saveSettings}>
        שמירת הגדרות
      </button>
    </section>
  );
}

export default SettingsAdmin;
