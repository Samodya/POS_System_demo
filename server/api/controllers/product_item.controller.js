// controllers/productItemController.js
const productItemService = require("../services/product_item.service");

// Create
const createProductItem = async (req, res) => {
  try {
    const item = await productItemService.createProductItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
const getProductItems = async (req, res) => {
  try {
    const items = await productItemService.getProductItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one
const getProductItemById = async (req, res) => {
  try {
    const item = await productItemService.getProductItemById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update
const updateProductItem = async (req, res) => {
  try {
    const item = await productItemService.updateProductItem(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
const deleteProductItem = async (req, res) => {
  try {
    const result = await productItemService.deleteProductItem(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createProductItem,
  getProductItems,
  getProductItemById,
  updateProductItem,
  deleteProductItem,
};
