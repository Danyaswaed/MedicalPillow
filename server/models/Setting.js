const db = require("../config/db");

const getByKey = (key, callback) => {
  db.query(
    "SELECT setting_value FROM settings WHERE setting_key = ?",
    [key],
    callback,
  );
};

const updateByKey = (key, value, callback) => {
  db.query(
    "UPDATE settings SET setting_value = ? WHERE setting_key = ?",
    [value, key],
    callback,
  );
};

const getSiteSettings = (callback) => {
  const keys = [
    "delivery_price",
    "site_phone",
    "site_email",
    "site_whatsapp",
    "site_address",
    "site_instagram",
  ];

  db.query(
    "SELECT setting_key, setting_value FROM settings WHERE setting_key IN (?)",
    [keys],
    callback,
  );
};

const updateMultipleSettings = (settings, callback) => {
  const entries = Object.entries(settings);

  if (entries.length === 0) {
    return callback(null);
  }

  let completed = 0;
  let hasError = false;

  entries.forEach(([key, value]) => {
    const sql = `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `;

    db.query(sql, [key, value], (err) => {
      if (hasError) return;

      if (err) {
        hasError = true;
        return callback(err);
      }

      completed++;

      if (completed === entries.length) {
        callback(null);
      }
    });
  });
};

module.exports = {
  getByKey,
  updateByKey,
  getSiteSettings,
  updateMultipleSettings,
};
