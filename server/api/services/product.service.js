// services/product.service.js
const connectMySQLDB = require("../../config");
const { createInProductsStockLog } = require("./stock_log.service");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createProduct = async (productData, file) => {
  const { name, category, description, itemmodel_id } = productData;

  // Validation: prevent null or empty values
  if (!name || name.trim() === "") {
    throw new Error("Product name is required");
  }
  if (!category || category.trim() === "") {
    throw new Error("Category is required");
  }
  if (!itemmodel_id || itemmodel_id === null) {
    throw new Error("Item model ID is required");
  }

  const image_path = file ? file.path : null;
  const image_name = file ? file.filename : null;
  const image_size = file ? file.size : null;

  const query = `
    INSERT INTO products 
    (name, category, itemmodel_id, description, image_path, image_name, image_size) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    category,
    itemmodel_id,
    description,
    image_path,
    image_name,
    image_size,
  ];

  const [result] = await db.query(query, values);

  return {
    id: result.insertId,
    ...productData,
    image_path,
    image_name,
    image_size,
  };
};


const getAllProducts = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM products 
    ORDER BY created_at DESC
  `);
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.query(
    ` SELECT *
    FROM products 
     WHERE id = ?`,
    [id]
  );
  return rows[0];
};

const updateProduct = async (id, productData, file) => {
  const { name, category, description, itemmodel_id } = productData;

  // Validation: prevent null or empty values
  if (!name || name.trim() === "") {
    throw new Error("Product name is required");
  }
  if (!category || category.trim() === "") {
    throw new Error("Category is required");
  }
  if (!itemmodel_id || itemmodel_id === null) {
    throw new Error("Item model ID is required");
  }

  // Base query
  let query = `
    UPDATE products SET 
      name = ?, 
      category = ?, 
      description = ?,
      itemmodel_id = ?
  `;

  // Base values
  let values = [
    name,
    category,
    description,
    itemmodel_id,
  ];

  // Add file data if present
  if (file) {
    query += `, image_path = ?, image_name = ?, image_size = ?`;
    values.push(file.path, file.filename, file.size);
  }

  query += ` WHERE products.id = ?`;
  values.push(id);

  await db.query(query, values);

  return {
    id,
    ...productData,
    ...(file && {
      image_path: file.path,
      image_name: file.filename,
      image_size: file.size,
    }),
  };
};

const deleteProduct = async (id) => {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
};

const reduceProductQuantity = async (productId, qty) => {
  const query = `
    UPDATE products 
    SET quantity = quantity - ? 
    WHERE id = ? AND quantity >= ?`;

  await db.query(query, [qty, productId, qty]);
};

const increaseProductQuantity = async (product_id, qty) => {
  console.log(`Attempting to increase quantity for product_id: ${product_id} by: ${qty}`);

  const query = `
    UPDATE products 
    SET quantity = quantity + ? 
    WHERE id = ?`;

  try {
    const [result] = await db.query(query, [qty, product_id]);
    console.log(`Database update successful. Rows affected: ${result.affectedRows}`);
    if (result.affectedRows === 0) {
      console.log('Warning: No rows were updated. The product_id might be incorrect.');
    }
  } catch (error) {
    console.error('Error during database update:', error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reduceProductQuantity,
  increaseProductQuantity,
};
