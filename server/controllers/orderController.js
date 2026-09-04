const Order = require("../models/Order");
const Product = require("../models/Product");
const Setting = require("../models/Setting");

const createOrder = (req, res) => {
  const user_id = req.user.user_id || req.user.id;

  const {
    delivery_method,
    payment_method,
    delivery_address,
    city,
    postal_code,
    items,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Cart is empty",
    });
  }

  if (!["delivery", "pickup"].includes(delivery_method)) {
    return res.status(400).json({
      message: "Invalid delivery method",
    });
  }

  // PayPal ו-Visa יקבלו מסלולים נפרדים
  if (payment_method !== "cash") {
    return res.status(400).json({
      message: "This payment method requires online payment",
    });
  }

  if (delivery_method === "delivery" && (!delivery_address || !city)) {
    return res.status(400).json({
      message: "Delivery address and city are required",
    });
  }

  const normalizedItemsMap = new Map();

  for (const item of items) {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Invalid cart item",
      });
    }

    normalizedItemsMap.set(
      productId,
      (normalizedItemsMap.get(productId) || 0) + quantity,
    );
  }

  const normalizedItems = Array.from(
    normalizedItemsMap,
    ([product_id, quantity]) => ({
      product_id,
      quantity,
    }),
  );

  const productIds = normalizedItems.map((item) => item.product_id);

  Product.getByIds(productIds, (productErr, products) => {
    if (productErr) {
      return res.status(500).json({
        message: "Failed to read products",
        error: productErr,
      });
    }

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products are unavailable",
      });
    }

    const productMap = new Map(
      products.map((product) => [Number(product.product_id), product]),
    );

    for (const item of normalizedItems) {
      const product = productMap.get(item.product_id);

      if (item.quantity > Number(product.stock)) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }
    }

    const subtotalAgorot = normalizedItems.reduce((sum, item) => {
      const product = productMap.get(item.product_id);
      const priceAgorot = Math.round(Number(product.price) * 100);

      return sum + priceAgorot * item.quantity;
    }, 0);

    Setting.getByKey("delivery_price", (settingErr, rows) => {
      if (settingErr) {
        return res.status(500).json({
          message: "Failed to read delivery price",
          error: settingErr,
        });
      }

      const deliveryPrice =
        delivery_method === "delivery"
          ? Number(rows[0]?.setting_value || 0)
          : 0;

      const totalPrice =
        (subtotalAgorot + Math.round(deliveryPrice * 100)) / 100;

      const orderData = {
        user_id,
        total_price: totalPrice,
        delivery_method,
        payment_method: "cash",
        delivery_address:
          delivery_method === "delivery" ? delivery_address : null,
        city: delivery_method === "delivery" ? city : null,
        postal_code:
          delivery_method === "delivery" ? postal_code || null : null,
      };

      Order.createOrder(orderData, (orderErr, result) => {
        if (orderErr) {
          return res.status(500).json({
            message: "Failed to create order",
            error: orderErr,
          });
        }

        const order_id = result.insertId;

        const saveItems = normalizedItems.map((item) => {
          const product = productMap.get(item.product_id);

          return new Promise((resolve, reject) => {
            Order.addOrderItem(
              {
                order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: Number(product.price),
              },
              (itemErr) => {
                if (itemErr) return reject(itemErr);
                resolve();
              },
            );
          });
        });

        Promise.all(saveItems)
          .then(() => {
            Order.addTracking(order_id, (trackingErr) => {
              if (trackingErr) {
                return res.status(500).json({
                  message: "Order created, but tracking failed",
                  error: trackingErr,
                });
              }

              return res.status(201).json({
                message: "Order created successfully",
                order_id,
                total_price: totalPrice,
              });
            });
          })
          .catch((itemErr) => {
            return res.status(500).json({
              message: "Failed to save order items",
              error: itemErr,
            });
          });
      });
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
