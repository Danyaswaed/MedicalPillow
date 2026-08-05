const db = require("../config/db");

const createUser = (user, callback) => {
  const sql = `
    INSERT INTO users 
    (first_name, last_name, email, phone, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user.first_name,
      user.last_name,
      user.email,
      user.phone,
      user.password,
      user.role || "customer",
    ],
    callback,
  );
};

const findByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

module.exports = {
  createUser,
  findByEmail,
};
