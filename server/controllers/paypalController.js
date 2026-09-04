const Order = require("../models/Order");
const Product = require("../models/Product");
const Setting = require("../models/Setting");

const {
  paypalOrdersController,
  CheckoutPaymentIntent,
} = require("../config/paypal");

const modelCall = (method, ...args) =>
  new Promise((resolve, reject) => {
    method(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

const isPaypalAuthenticationError = (error) =>
  error.statusCode === 401 || error.result?.error === "invalid_client";

const calculateCart = async (items, deliveryMethod) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const quantities = new Map();

  for (const item of items) {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      const error = new Error("Invalid cart item");
      error.statusCode = 400;
      throw error;
    }

    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
  }

  const normalizedItems = Array.from(quantities, ([product_id, quantity]) => ({
    product_id,
    quantity,
  }));

  const productIds = normalizedItems.map((item) => item.product_id);

  const products = await modelCall(Product.getByIds, productIds);

  if (products.length !== productIds.length) {
    const error = new Error("One or more products are unavailable");
    error.statusCode = 400;
    throw error;
  }

  const productsMap = new Map(
    products.map((product) => [Number(product.product_id), product]),
  );

  let subtotalAgorot = 0;

  for (const item of normalizedItems) {
    const product = productsMap.get(item.product_id);

    if (item.quantity > Number(product.stock)) {
      const error = new Error(`Not enough stock for ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    subtotalAgorot += Math.round(Number(product.price) * 100) * item.quantity;
  }

  let deliveryPrice = 0;

  if (deliveryMethod === "delivery") {
    const rows = await modelCall(Setting.getByKey, "delivery_price");

    deliveryPrice = Number(rows[0]?.setting_value || 0);
  }

  const totalPrice = (subtotalAgorot + Math.round(deliveryPrice * 100)) / 100;

  return {
    normalizedItems,
    productsMap,
    totalPrice,
  };
};

const createPaypalOrder = async (req, res) => {
  try {
    const userId = Number(req.user.user_id || req.user.id);

    const { delivery_method, delivery_address, city, postal_code, items } =
      req.body;

    if (!["delivery", "pickup"].includes(delivery_method)) {
      return res.status(400).json({
        message: "Invalid delivery method",
      });
    }

    if (delivery_method === "delivery" && (!delivery_address || !city)) {
      return res.status(400).json({
        message: "Delivery address and city are required",
      });
    }

    const { normalizedItems, productsMap, totalPrice } = await calculateCart(
      items,
      delivery_method,
    );

    const { result: paypalOrder } = await paypalOrdersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "ILS",
              value: totalPrice.toFixed(2),
            },
            description: "Cervica order",
          },
        ],
      },
    });

    if (!paypalOrder?.id) {
      throw new Error("PayPal did not return an order ID");
    }

    const localResult = await modelCall(Order.createOrder, {
      user_id: userId,
      total_price: totalPrice,
      delivery_method,
      payment_method: "paypal",
      payment_status: "Pending",
      paypal_order_id: paypalOrder.id,
      paypal_capture_id: null,
      delivery_address:
        delivery_method === "delivery" ? delivery_address : null,
      city: delivery_method === "delivery" ? city : null,
      postal_code: delivery_method === "delivery" ? postal_code || null : null,
    });

    const localOrderId = localResult.insertId;

    await Promise.all(
      normalizedItems.map((item) => {
        const product = productsMap.get(item.product_id);

        return modelCall(Order.addOrderItem, {
          order_id: localOrderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(product.price),
        });
      }),
    );

    await modelCall(Order.addTracking, localOrderId);

    return res.status(201).json({
      orderId: paypalOrder.id,
      localOrderId,
      total_price: totalPrice,
    });
  } catch (error) {
    if (isPaypalAuthenticationError(error)) {
      console.error("PayPal credentials were rejected", {
        paypalDebugId: error.headers?.["paypal-debug-id"],
      });

      return res.status(503).json({
        message: "PayPal is not configured correctly on the server",
      });
    }

    console.error("Create PayPal order error:", error.message);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create PayPal order",
    });
  }
};

const capturePaypalOrder = async (req, res) => {
  try {
    const paypalOrderId = req.params.paypalOrderId;
    const loggedUserId = Number(req.user.user_id || req.user.id);

    const rows = await modelCall(Order.getByPayPalOrderId, paypalOrderId);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const localOrder = rows[0];

    if (Number(localOrder.user_id) !== loggedUserId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (localOrder.payment_status === "Paid") {
      return res.json({
        paid: true,
        order_id: localOrder.order_id,
        capture_id: localOrder.paypal_capture_id,
      });
    }

    const { result: paypalResult } = await paypalOrdersController.captureOrder({
      id: paypalOrderId,
    });

    const capture = paypalResult.purchaseUnits?.[0]?.payments?.captures?.[0];

    if (paypalResult.status !== "COMPLETED" || !capture?.id) {
      return res.status(400).json({
        message: "PayPal payment was not completed",
        status: paypalResult.status,
      });
    }

    const capturedCurrency = capture.amount?.currencyCode;

    const capturedAgorot = Math.round(Number(capture.amount?.value) * 100);

    const expectedAgorot = Math.round(Number(localOrder.total_price) * 100);

    if (capturedCurrency !== "ILS" || capturedAgorot !== expectedAgorot) {
      console.error("PayPal amount mismatch", {
        paypalOrderId,
        capturedCurrency,
        capturedAgorot,
        expectedAgorot,
      });

      return res.status(409).json({
        message: "Captured amount does not match order",
      });
    }

    await modelCall(Order.markPayPalPaid, paypalOrderId, capture.id);

    return res.json({
      paid: true,
      order_id: localOrder.order_id,
      paypal_order_id: paypalOrderId,
      capture_id: capture.id,
    });
  } catch (error) {
    if (isPaypalAuthenticationError(error)) {
      console.error("PayPal credentials were rejected", {
        paypalDebugId: error.headers?.["paypal-debug-id"],
      });

      return res.status(503).json({
        message: "PayPal is not configured correctly on the server",
      });
    }

    console.error("Capture PayPal order error:", error.message);

    return res.status(500).json({
      message: error.message || "Failed to capture PayPal payment",
    });
  }
};

module.exports = {
  createPaypalOrder,
  capturePaypalOrder,
};
