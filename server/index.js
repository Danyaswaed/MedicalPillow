// index.js
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const verifyToken = require("./middleware/verifyToken");
const isAdmin = require("./middleware/auth");
const { getDashboard } = require("./controllers/adminController");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paypalRoutes = require("./routes/paypalRoutes");


app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/admin/dashboard", verifyToken, isAdmin, getDashboard);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/paypal", paypalRoutes);
app.get("/", (req, res) => {
  res.send("Medical Pillow API Running");
});

const PORT = process.env.PORT || 5000;
app.get("/api/admin/test", (req, res) => {
  res.json({ message: "admin test works" });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
