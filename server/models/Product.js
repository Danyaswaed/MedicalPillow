const db = require("../config/db");

const getAll = (callback) => {
  db.query("SELECT * FROM products WHERE is_active = TRUE", callback);
};

const getById = (id, callback) => {
  db.query("SELECT * FROM products WHERE product_id = ?", [id], callback);
};
const getByIds = (ids, callback) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return callback(null, []);
  }

  const placeholders = ids.map(() => "?").join(",");

  const sql = `
    SELECT product_id, name, price, stock
    FROM products
    WHERE product_id IN (${placeholders})
      AND is_active = TRUE
  `;

  db.query(sql, ids, callback);
};
const create = (product, callback) => {
  const sql = `
    INSERT INTO products
    (name, description, price, stock, weight, warranty, image, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.weight,
      product.warranty,
      product.image,
      product.is_active ?? true,
    ],
    callback,
  );
};

const update = (id, product, callback) => {
  const sql = `
    UPDATE products
    SET name=?, description=?, price=?, stock=?, weight=?, warranty=?, image=?, is_active=?
    WHERE product_id=?
  `;

  db.query(
    sql,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.weight,
      product.warranty,
      product.image,
      product.is_active ?? true,
      id,
    ],
    callback,
  );
};

const remove = (id, callback) => {
  db.query(
    "UPDATE products SET is_active = FALSE WHERE product_id = ?",
    [id],
    callback,
  );
};

module.exports = {
  getAll,
  getById,
  getByIds,
  create,
  update,
  remove,
};
