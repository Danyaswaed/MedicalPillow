const Order = require("../models/Order");

const createOrder = (req, res) => {
  const user_id = req.user.user_id;

  const {
    total_price,
    delivery_method,
    payment_method,
    delivery_address,
    city,
    postal_code,
    items,
  } = req.body;

  const orderData = {
    user_id,
    total_price,
    delivery_method,
    payment_method,
    delivery_address,
    city,
    postal_code,
  };

  Order.createOrder(orderData, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to create order",
        error: err,
      });
    }

    const order_id = result.insertId;

    if (items && items.length > 0) {
      items.forEach((item) => {
        Order.addOrderItem(
          {
            order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          },
          () => {},
        );
      });
    }

    Order.addTracking(order_id, () => {});

    res.status(201).json({
      message: "Order created successfully",
      order_id,
    });
  });
};

const getOrders = (req, res) => {
  Order.getAllOrders((err, orders) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get orders",
        error: err,
      });
    }

    res.json(orders);
  });
};

const updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Status is required",
    });
  }

  Order.updateStatus(orderId, status, (err, result) => {
    if (err) {
      console.log("Update order status error:", err);

      return res.status(500).json({
        message: "Failed to update order status",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    Order.addTrackingStatus(
      orderId,
      status,
      `Order status changed to ${status}`,
      (trackingErr) => {
        if (trackingErr) {
          console.log("Tracking insert error:", trackingErr);
        }

        return res.json({
          message: "Order status updated successfully",
          order_id: orderId,
          status,
        });
      },
    );
  });
};

const getOrderTracking = (req, res) => {
  const orderId = req.params.id;

  Order.getTrackingByOrderId(orderId, (err, tracking) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get tracking",
        error: err,
      });
    }

    if (!tracking || tracking.length === 0) {
      return res.status(404).json({
        message: "Tracking not found",
      });
    }

    res.json({
      order_id: tracking[0].order_id,
      current_status: tracking[0].current_status,
      order_date: tracking[0].order_date,
      tracking,
    });
  });
};

const getOrderDetails = (req, res) => {
  const orderId = req.params.id;

  Order.getOrderDetails(orderId, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get order details",
        error: err,
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const first = rows[0];

    const loggedUserId = Number(req.user.user_id || req.user.id);
    const orderUserId = Number(first.user_id);

    if (req.user.role !== "admin" && orderUserId !== loggedUserId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const order = {
      order_id: first.order_id,
      user_id: first.user_id,
      total_price: first.total_price,
      delivery_method: first.delivery_method,
      payment_method: first.payment_method,
      delivery_address: first.delivery_address,
      city: first.city,
      postal_code: first.postal_code,
      status: first.status,
      order_date: first.order_date,

      first_name: first.first_name,
      last_name: first.last_name,
      email: first.email,
      phone: first.phone,

      items: rows
        .filter((row) => row.order_item_id)
        .map((row) => ({
          order_item_id: row.order_item_id,
          product_id: row.product_id,
          product_name: row.product_name,
          product_image: row.product_image,
          quantity: row.quantity,
          price: row.price,
        })),
    };

    res.json(order);
  });
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderTracking,
  getOrderDetails,
};
