const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.post("/", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const sql = `
    INSERT INTO contact_messages
    (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, subject, message], (err) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({ message: "Message sent successfully" });
  });
});

module.exports = router;
