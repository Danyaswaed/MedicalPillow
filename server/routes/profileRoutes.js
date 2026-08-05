const express = require("express");
const router = express.Router();

const verifyToken = require("../Middleware/verifyToken");

const {
  getProfile,
  updateProfile,
  getMyOrders,
  changePassword,
} = require("../controllers/profileController");

router.get("/", verifyToken, getProfile);

router.put("/", verifyToken, updateProfile);

router.get("/orders", verifyToken, getMyOrders);

router.put("/password", verifyToken, changePassword);

module.exports = router;
