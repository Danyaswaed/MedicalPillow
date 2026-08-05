const db = require("../config/db");

const createOrder = (order, callback) => {
  const sql = `
    INSERT INTO orders
    (user_id, total_price, delivery_method, payment_method, delivery_address, city, postal_code, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      order.user_id,
      order.total_price,
      order.delivery_method,
      order.payment_method,
      order.delivery_address,
      order.city,
      order.postal_code,
      "Pending",
    ],
    callback,
  );
};

const addOrderItem = (item, callback) => {
  const sql = `
    INSERT INTO order_items
    (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [item.order_id, item.product_id, item.quantity, item.price],
    callback,
  );
};

const addTracking = (order_id, callback) => {
  const sql = `
    INSERT INTO order_tracking
    (order_id, status, notes)
    VALUES (?, 'Pending', 'Order received')
  `;

  db.query(sql, [order_id], callback);
};

const addTrackingStatus = (order_id, status, notes, callback) => {
  const sql = `
    INSERT INTO order_tracking
    (order_id, status, notes)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [order_id, status, notes], callback);
};

const getAllOrders = (callback) => {
  const sql = `
    SELECT 
      orders.*,
      users.first_name,
      users.last_name,
      users.email,
      users.phone
    FROM orders
    JOIN users ON orders.user_id = users.user_id
    ORDER BY orders.order_date DESC
  `;

  db.query(sql, callback);
};

const updateStatus = (order_id, status, callback) => {
  const sql = `
    UPDATE orders
    SET status = ?
    WHERE order_id = ?
  `;

  db.query(sql, [status, order_id], callback);
};

const getTrackingByOrderId = (order_id, callback) => {
  const sql = `
    SELECT 
      orders.order_id,
      orders.status AS current_status,
      orders.order_date,
      order_tracking.status,
      order_tracking.notes,
      order_tracking.updated_at
    FROM orders
    LEFT JOIN order_tracking ON orders.order_id = order_tracking.order_id
    WHERE orders.order_id = ?
    ORDER BY order_tracking.updated_at ASC
  `;

  db.query(sql, [order_id], callback);
};

const getOrderDetails = (order_id, callback) => {
  const sql = `
    SELECT 
      orders.order_id,
      orders.user_id,
      orders.total_price,
      orders.delivery_method,
      orders.payment_method,
      orders.delivery_address,
      orders.city,
      orders.postal_code,
      orders.status,
      orders.order_date,

      users.first_name,
      users.last_name,
      users.email,
      users.phone,

      order_items.order_item_id,
      order_items.product_id,
      order_items.quantity,
      order_items.price,

      products.name AS product_name,
      products.image AS product_image

    FROM orders
    JOIN users ON orders.user_id = users.user_id
    LEFT JOIN order_items ON orders.order_id = order_items.order_id
    LEFT JOIN products ON order_items.product_id = products.product_id
    WHERE orders.order_id = ?
  `;

  db.query(sql, [order_id], callback);
};

module.exports = {
  createOrder,
  addOrderItem,
  addTracking,
  addTrackingStatus,
  getAllOrders,
  updateStatus,
  getTrackingByOrderId,
  getOrderDetails,
};
