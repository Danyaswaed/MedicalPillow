const express = require("express");
const router = express.Router();

const verifyToken = require("../Middleware/verifyToken");
const isAdmin = require("../Middleware/auth");

const {
  getDashboard,
  getCustomers,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  replyToMessage,
  getMonthlyReport,
  downloadMonthlyReport,
} = require("../controllers/adminController");
router.get("/reports/monthly", verifyToken, isAdmin, getMonthlyReport);
router.get(
  "/reports/monthly/download",
  verifyToken,
  isAdmin,
  downloadMonthlyReport,
);
router.get("/dashboard", verifyToken, isAdmin, getDashboard);
router.get("/customers", verifyToken, isAdmin, getCustomers);
router.get("/messages", verifyToken, isAdmin, getMessages);

router.put("/messages/:id", verifyToken, isAdmin, updateMessageStatus);
router.delete("/messages/:id", verifyToken, isAdmin, deleteMessage);
router.post("/messages/:id/reply", verifyToken, isAdmin, replyToMessage);

module.exports = router;
