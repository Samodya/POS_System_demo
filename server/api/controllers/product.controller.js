// controllers/product.controller.js
const productService = require("../services/product.service");

const create = async (req, res) => {
    try {
      const product = await productService.createProduct(req.body, req.file); // pass req.file directly
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
    const image = req.file || null;
    const data = { ...req.body };

    const updated = await productService.updateProduct(req.params.id, data, image);
    res.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

const getTotalBuyingPrice = async (req, res) => {
  try {
    const total = await productService.getTotalBuyingPrice();
    res.json({ total_buying_price: total });
  } catch (error) {
    console.error("Error fetching total buying price:", error);
    res.status(500).json({ message: "Failed to fetch total buying price" });
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
  getTotalBuyingPrice
};
