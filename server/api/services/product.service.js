// services/product.service.js
const connectMySQLDB = require("../../config"); 

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createProduct = async (data) => {
  const {
    name,
    category,
    price,
    quantity,
    description,
    image_path,
    image_name,
    image_size,
  } = data;

  const [result] = await db.query(
    `INSERT INTO products (name, category, price, quantity, description, image_path, image_name, image_size)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category, price, quantity, description, image_path, image_name, image_size]
  );

  return { id: result.insertId, ...data };
};

const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

const updateProduct = async (id, data) => {
  const {
    name,
    category,
    price,
    quantity,
    description,
    image_path,
    image_name,
    image_size,
  } = data;

  await db.query(
    `UPDATE products
     SET name = ?, category = ?, price = ?, quantity = ?, description = ?, image_path = ?, image_name = ?, image_size = ?
     WHERE id = ?`,
    [name, category, price, quantity, description, image_path, image_name, image_size, id]
  );

  return { id, ...data };
};

const deleteProduct = async (id) => {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
