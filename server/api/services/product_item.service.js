// services/productItemService.js
const db = require("../../config");

// Create new product item
const createProductItem = async (itemData) => {
  const {
    serial_no,
    buying_price,
    retail_price,
    dealers_price,
    warranty_period,
    conditions,
    product_id,
  } = itemData;

  // Validation
  if (!serial_no || serial_no.trim() === "") {
    throw new Error("Serial number is required");
  }
  if (!buying_price || !retail_price || !dealers_price) {
    throw new Error("Prices are required");
  }
  if (!product_id) {
    throw new Error("Product ID is required");
  }

  const query = `
    INSERT INTO product_item
    (serial_no, buying_price, retail_price, dealers_price, warranty_period, conditions, product_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    serial_no,
    buying_price,
    retail_price,
    dealers_price,
    warranty_period || null,
    conditions || null,
    product_id,
  ];

  const [result] = await db.query(query, values);

  return { id: result.insertId, ...itemData };
};

// Get all product items
const getProductItems = async () => {
  const [rows] = await db.query("SELECT * FROM product_item");
  return rows;
};

// Get single product item
const getProductItemById = async (id) => {
  const [rows] = await db.query("SELECT * FROM product_item WHERE id = ?", [id]);
  if (!rows.length) throw new Error("Product item not found");
  return rows[0];
};

// Update product item
const updateProductItem = async (id, itemData) => {
  const {
    serial_no,
    buying_price,
    retail_price,
    dealers_price,
    warranty_period,
    conditions,
    product_id,
  } = itemData;

  const query = `
    UPDATE product_item SET
      serial_no = ?,
      buying_price = ?,
      retail_price = ?,
      dealers_price = ?,
      warranty_period = ?,
      conditions = ?,
      product_id = ?
    WHERE id = ?
  `;

  const values = [
    serial_no,
    buying_price,
    retail_price,
    dealers_price,
    warranty_period || null,
    conditions || null,
    product_id,
    id,
  ];

  await db.query(query, values);

  return { id, ...itemData };
};

// Delete product item
const deleteProductItem = async (id) => {
  await db.query("DELETE FROM product_item WHERE id = ?", [id]);
  return { message: "Product item deleted successfully" };
};

module.exports = {
  createProductItem,
  getProductItems,
  getProductItemById,
  updateProductItem,
  deleteProductItem,
};
