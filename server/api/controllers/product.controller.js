// controllers/product.controller.js
const productService = require("../services/product.service");

const create = async (req, res) => {
  try {
    const image = req.file;
    const data = {
      ...req.body,
      image_path: image?.path,
      image_name: image?.originalname,
      image_size: image?.size,
    };
    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (_req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Failed to get products" });
  }
};

const getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to get product" });
  }
};

const update = async (req, res) => {
  try {
    const image = req.file;
    const data = {
      ...req.body,
      image_path: image?.path,
      image_name: image?.originalname,
      image_size: image?.size,
    };
    const updated = await productService.updateProduct(req.params.id, data);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update product" });
  }
};

const remove = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
