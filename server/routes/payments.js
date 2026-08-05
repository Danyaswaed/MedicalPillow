const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "Payments route ready" });
});

module.exports = router;
