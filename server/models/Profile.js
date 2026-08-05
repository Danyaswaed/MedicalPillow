const db = require("../config/db");

const getProfile = (userId, callback) => {
  db.query(
    `
    SELECT
      user_id,
      first_name,
      last_name,
      email,
      phone
    FROM users
    WHERE user_id=?
    `,
    [userId],
    callback,
  );
};

const updateProfile = (userId, data, callback) => {
  db.query(
    `
    UPDATE users
    SET
      first_name=?,
      last_name=?,
      email=?,
      phone=?
    WHERE user_id=?
    `,
    [data.first_name, data.last_name, data.email, data.phone, userId],
    callback,
  );
};

const getOrders = (userId, callback) => {
  db.query(
    `
    SELECT *
    FROM orders
    WHERE user_id=?
    ORDER BY order_date DESC
    `,
    [userId],
    callback,
  );
};

module.exports = {
  getProfile,
  updateProfile,
  getOrders,
};
