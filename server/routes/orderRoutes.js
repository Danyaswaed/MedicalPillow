const express = require("express");
const router = express.Router();

const verifyToken = require("../Middleware/verifyToken");
const isAdmin = require("../Middleware/auth");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderTracking,
  getOrderDetails,
} = require("../controllers/orderController");

router.post("/", verifyToken, createOrder);

router.get("/", verifyToken, isAdmin, getOrders);

router.get("/:id/details", verifyToken, getOrderDetails);

router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

router.get("/:id/tracking", verifyToken, getOrderTracking);

module.exports = router;
