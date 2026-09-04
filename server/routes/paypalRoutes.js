const express = require("express");
const router = express.Router();

const verifyToken = require("../Middleware/verifyToken");

const {
  createPaypalOrder,
  capturePaypalOrder,
} = require("../controllers/paypalController");

router.post("/create-order", verifyToken, createPaypalOrder);
router.post("/capture-order", verifyToken, capturePaypalOrder);

module.exports = router;
