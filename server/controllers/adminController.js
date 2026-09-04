// server/controllers/adminController.js

const db = require("../config/db");
const { sendReply } = require("../utils/mailer");
const ExcelJS = require("exceljs");

/* =========================
   Dashboard
========================= */

const getDashboard = (req, res) => {
  const dashboard = {};

  db.query(
    "SELECT COUNT(*) AS totalCustomers FROM users WHERE role='customer'",
    (err, users) => {
      if (err) return res.status(500).json(err);

      dashboard.totalCustomers = users[0].totalCustomers;

      db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, orders) => {
        if (err) return res.status(500).json(err);

        dashboard.totalOrders = orders[0].totalOrders;

        db.query(
          "SELECT COUNT(*) AS preparing FROM orders WHERE status='Preparing'",
          (err, preparing) => {
            if (err) return res.status(500).json(err);

            dashboard.preparing = preparing[0].preparing;

            db.query(
              "SELECT COUNT(*) AS shipped FROM orders WHERE status='Shipped'",
              (err, shipped) => {
                if (err) return res.status(500).json(err);

                dashboard.shipped = shipped[0].shipped;

                db.query(
                  "SELECT COUNT(*) AS delivered FROM orders WHERE status='Delivered'",
                  (err, delivered) => {
                    if (err) return res.status(500).json(err);

                    dashboard.delivered = delivered[0].delivered;

                    db.query(
                      `
                      SELECT IFNULL(SUM(total_price), 0) AS revenue
                      FROM orders
                      WHERE status != 'Cancelled'
                      `,
                      (err, revenue) => {
                        if (err) return res.status(500).json(err);

                        dashboard.revenue = revenue[0].revenue;

                        db.query(
                          `
                          SELECT 
                            orders.order_id,
                            orders.total_price,
                            orders.delivery_method,
                            orders.payment_method,
                            orders.status,
                            orders.order_date,
                            users.first_name,
                            users.last_name,
                            users.phone
                          FROM orders
                          JOIN users ON orders.user_id = users.user_id
                          ORDER BY orders.order_date DESC
                          LIMIT 8
                          `,
                          (err, recentOrders) => {
                            if (err) return res.status(500).json(err);

                            dashboard.recentOrders = recentOrders;

                            db.query(
                              `
                              SELECT COUNT(*) AS unreadMessages
                              FROM contact_messages
                              WHERE status='Unread' AND is_deleted=0
                              `,
                              (err, msgCount) => {
                                if (err) return res.status(500).json(err);

                                dashboard.unreadMessages =
                                  msgCount[0].unreadMessages;

                                res.json(dashboard);
                              },
                            );
                          },
                        );
                      },
                    );
                  },
                );
              },
            );
          },
        );
      });
    },
  );
};

/* =========================
   Helpers
========================= */

const translateStatus = (status) => {
  const statuses = {
    Pending: "התקבלה",
    Paid: "התשלום אושר",
    Preparing: "בהכנה",
    Shipped: "במשלוח",
    Delivered: "נמסרה",
    Cancelled: "בוטלה",
  };

  return statuses[status] || status;
};

const translateDelivery = (value) => {
  return value === "delivery" ? "משלוח" : "איסוף עצמי";
};

const translatePayment = (value) => {
  return value === "cash" ? "מזומן" : "ויזה";
};

/* =========================
   Monthly Reports
========================= */

const getMonthlyReport = (req, res) => {
  const { month, year } = req.query;

  const sql = `
    SELECT 
      orders.order_id,
      orders.total_price,
      orders.delivery_method,
      orders.payment_method,
      orders.status,
      orders.order_date,
      users.first_name,
      users.last_name,
      users.phone,
      users.email
    FROM orders
    JOIN users ON orders.user_id = users.user_id
    WHERE MONTH(orders.order_date) = ? 
      AND YEAR(orders.order_date) = ?
    ORDER BY orders.order_date DESC
  `;

  db.query(sql, [month, year], (err, rows) => {
    if (err) return res.status(500).json(err);

    const totalRevenue = rows.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0,
    );

    res.json({
      summary: {
        month,
        year,
        totalOrders: rows.length,
        totalRevenue,
      },
      orders: rows,
    });
  });
};

const downloadMonthlyReport = (req, res) => {
  const { month, year } = req.query;

  const sql = `
    SELECT 
      orders.order_id,
      orders.total_price,
      orders.delivery_method,
      orders.payment_method,
      orders.status,
      orders.order_date,
      users.first_name,
      users.last_name,
      users.phone,
      users.email
    FROM orders
    JOIN users ON orders.user_id = users.user_id
    WHERE MONTH(orders.order_date) = ? 
      AND YEAR(orders.order_date) = ?
    ORDER BY orders.order_date DESC
  `;

  db.query(sql, [month, year], async (err, rows) => {
    if (err) return res.status(500).json(err);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("דוח חודשי");

    sheet.views = [{ rightToLeft: true }];

    sheet.columns = [
      { header: "מספר הזמנה", key: "order_id", width: 16 },
      { header: "שם לקוח", key: "customer", width: 24 },
      { header: "טלפון", key: "phone", width: 18 },
      { header: "אימייל", key: "email", width: 30 },
      { header: "סכום", key: "total_price", width: 14 },
      { header: "קבלה", key: "delivery_method", width: 16 },
      { header: "תשלום", key: "payment_method", width: 16 },
      { header: "סטטוס", key: "status", width: 18 },
      { header: "תאריך", key: "order_date", width: 22 },
    ];

    sheet.getRow(1).font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF071A3D" },
    };

    rows.forEach((row) => {
      sheet.addRow({
        order_id: row.order_id,
        customer: `${row.first_name} ${row.last_name}`,
        phone: row.phone,
        email: row.email,
        total_price: Number(row.total_price),
        delivery_method: translateDelivery(row.delivery_method),
        payment_method: translatePayment(row.payment_method),
        status: translateStatus(row.status),
        order_date: new Date(row.order_date).toLocaleDateString("he-IL"),
      });
    });

    const totalRevenue = rows.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0,
    );

    sheet.addRow([]);
    sheet.addRow(["סה״כ הזמנות", rows.length]);
    sheet.addRow(["סה״כ הכנסות", `₪ ${totalRevenue}`]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly-report-${month}-${year}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};

/* =========================
   Messages
========================= */

const getMessages = (req, res) => {
  db.query(
    `
    SELECT *
    FROM contact_messages
    WHERE is_deleted = 0
    ORDER BY created_at DESC
    `,
    (err, messages) => {
      if (err) return res.status(500).json(err);

      res.json(messages);
    },
  );
};

const updateMessageStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    `
    UPDATE contact_messages
    SET status = ?
    WHERE message_id = ? 
      AND is_deleted = 0
    `,
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Status updated" });
    },
  );
};

const deleteMessage = (req, res) => {
  const { id } = req.params;

  db.query(
    `
    UPDATE contact_messages
    SET is_deleted = 1
    WHERE message_id = ?
    `,
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Message deleted successfully" });
    },
  );
};

const replyToMessage = (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      message: "Reply message is required",
    });
  }

  db.query(
    `
    SELECT email, name
    FROM contact_messages
    WHERE message_id = ? 
      AND is_deleted = 0
    `,
    [id],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Message not found",
        });
      }

      try {
        await sendReply(
          result[0].email,
          subject || "Reply from Cervica",
          message,
        );

        db.query(
          `
          UPDATE contact_messages
          SET status = 'Answered'
          WHERE message_id = ?
          `,
          [id],
          (updateErr) => {
            if (updateErr) return res.status(500).json(updateErr);

            res.json({
              message: "Reply sent successfully",
            });
          },
        );
      } catch (error) {
        console.log("Email error:", error);

        res.status(500).json({
          message: "Failed to send email",
          error: error.message,
        });
      }
    },
  );
};

/* =========================
   Customers
========================= */

const getCustomers = (req, res) => {
  db.query(
    `
    SELECT 
      user_id,
      first_name,
      last_name,
      email,
      phone,
      city,
      created_at
    FROM users
    WHERE role = 'customer'
    ORDER BY created_at DESC
    `,
    (err, customers) => {
      if (err) return res.status(500).json(err);

      res.json(customers);
    },
  );
};

/* =========================
   Exports
========================= */

module.exports = {
  getDashboard,
  getCustomers,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  replyToMessage,
  getMonthlyReport,
  downloadMonthlyReport,
};
