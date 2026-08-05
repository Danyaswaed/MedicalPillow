const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const User = require("../models/User");

const getProfile = (req, res) => {
  const userId = req.user.user_id;

  Profile.getProfile(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  });
};

const updateProfile = (req, res) => {
  const userId = req.user.user_id;

  Profile.updateProfile(userId, req.body, (err) => {
    if (err) {
      return res.status(500).json({ message: "Update failed", error: err });
    }

    res.json({ message: "Profile updated successfully" });
  });
};

const getMyOrders = (req, res) => {
  const userId = req.user.user_id;

  Profile.getOrders(userId, (err, orders) => {
    if (err) {
      return res.status(500).json({ message: "Orders error", error: err });
    }

    res.json(orders);
  });
};

const changePassword = (req, res) => {
  const userId = req.user.user_id;
  const { currentPassword, newPassword } = req.body;

  const sqlEmail = req.user.email;

  User.findByEmail(sqlEmail, async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const db = require("../config/db");

    db.query(
      "UPDATE users SET password=? WHERE user_id=?",
      [hashedPassword, userId],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Password update failed", error: err });
        }

        res.json({ message: "Password changed successfully" });
      },
    );
  });
};

module.exports = {
  getProfile,
  updateProfile,
  getMyOrders,
  changePassword,
};
