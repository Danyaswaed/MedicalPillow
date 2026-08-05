const express = require("express");
const router = express.Router();

const verifyToken = require("../Middleware/verifyToken");
const isAdmin = require("../Middleware/auth");

const {
  getDeliveryPrice,
  updateDeliveryPrice,
  getSiteSettings,
  updateSiteSettings,
} = require("../controllers/settingsController");

router.get("/delivery-price", getDeliveryPrice);
router.put("/delivery-price", verifyToken, isAdmin, updateDeliveryPrice);

router.get("/site", getSiteSettings);
router.put("/site", verifyToken, isAdmin, updateSiteSettings);

module.exports = router;
