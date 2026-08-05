const Setting = require("../models/Setting");

const getDeliveryPrice = (req, res) => {
  Setting.getByKey("delivery_price", (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err,
      });
    }

    res.json({
      delivery_price: Number(result[0]?.setting_value || 0),
    });
  });
};

const updateDeliveryPrice = (req, res) => {
  const { delivery_price } = req.body;

  Setting.updateByKey("delivery_price", delivery_price, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Update failed",
        error: err,
      });
    }

    res.json({
      message: "Delivery price updated",
      delivery_price,
    });
  });
};

const getSiteSettings = (req, res) => {
  Setting.getSiteSettings((err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get settings",
        error: err,
      });
    }

    const settings = {};

    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    res.json(settings);
  });
};

const updateSiteSettings = (req, res) => {
  const {
    delivery_price,
    site_phone,
    site_email,
    site_whatsapp,
    site_address,
    site_instagram,
  } = req.body;

  const settings = {
    delivery_price,
    site_phone,
    site_email,
    site_whatsapp,
    site_address,
    site_instagram,
  };

  Setting.updateMultipleSettings(settings, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update settings",
        error: err,
      });
    }

    res.json({
      message: "Settings updated successfully",
    });
  });
};

module.exports = {
  getDeliveryPrice,
  updateDeliveryPrice,
  getSiteSettings,
  updateSiteSettings,
};
