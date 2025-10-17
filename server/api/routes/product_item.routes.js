// routes/productItemRoutes.js
const express = require("express");
const router = express.Router();
const productItemController = require("../controllers/product_item.controller");

// Create product item
router.post("/", productItemController.createProductItem);
router.get("/", productItemController.getProductItems);
router.get("/:id", productItemController.getProductItemById);
router.put("/:id", productItemController.updateProductItem);
router.delete("/:id", productItemController.deleteProductItem);

module.exports = router;
