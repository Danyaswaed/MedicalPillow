const Product = require("../models/Product");

const getProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json(products);
  });
};

const getProductById = (req, res) => {
  Product.getById(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]);
  });
};

const createProduct = (req, res) => {
  Product.create(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Create failed", error: err });
    }

    res.status(201).json({
      message: "Product created successfully",
      product_id: result.insertId,
    });
  });
};

const updateProduct = (req, res) => {
  Product.update(req.params.id, req.body, (err) => {
    if (err) {
      return res.status(500).json({ message: "Update failed", error: err });
    }

    res.json({ message: "Product updated successfully" });
  });
};

const deleteProduct = (req, res) => {
  Product.remove(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ message: "Delete failed", error: err });
    }

    res.json({ message: "Product disabled successfully" });
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
