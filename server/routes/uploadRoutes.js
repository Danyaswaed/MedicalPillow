const express = require("express");
const multer = require("multer");
const path = require("path");

const verifyToken = require("../Middleware/verifyToken");
const isAdmin = require("../Middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/product",
  verifyToken,
  isAdmin,
  upload.single("image"),
  (req, res) => {
    res.json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
      image_url: `/uploads/products/${req.file.filename}`,
    });
  },
);

module.exports = router;
