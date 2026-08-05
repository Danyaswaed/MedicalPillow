const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    User.createUser(
      {
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        role: "customer",
      },
      (err) => {
        if (err) {
          return res.status(500).json({
            message: "Registration failed",
            error: err,
          });
        }

        res.status(201).json({
          message: "User registered successfully",
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  });
};

module.exports = {
  register,
  login,
};
