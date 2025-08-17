// services/product.service.js
const connectMySQLDB = require("../../config"); 

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createProduct = async (productData, file) => {
  const {
    name,
    category,
    buying_price,
    price,
    dealers_price,
    quantity,
    description
  } = productData;

  const image_path = file ? file.path : null;
  const image_name = file ? file.filename : null;
  const image_size = file ? file.size : null;

  const query = `
    INSERT INTO products 
    (name, category,buying_price, price, dealers_price, quantity, description, image_path, image_name, image_size) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    name,
    category,
    buying_price,
    price,
    dealers_price,
    quantity,
    description,
    image_path,
    image_name,
    image_size
  ];

  const [result] = await db.query(query, values);
  return { id: result.insertId, ...productData, image_path, image_name, image_size };
};
const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

const updateProduct = async (id, productData, file) => {
  const {
    name,
    category,
    buying_price,
    price,
    dealers_price,
    quantity,
    description
  } = productData;

  // Start building update query
  let query = `
    UPDATE products SET 
      name = ?, 
      category = ?, 
      buying_price = ?, 
      price = ?, 
      dealers_price = ?, 
      quantity = ?, 
      description = ?
  `;
  
  let values = [name, category, buying_price, price, dealers_price, quantity, description];

  // Add image columns if a file is uploaded
  if (file) {
    query += `, image_path = ?, image_name = ?, image_size = ?`;
    values.push(file.path, file.filename, file.size);
  }

  query += ` WHERE id = ?`;
  values.push(id);

  await db.query(query, values);

  return { id, ...productData, ...(file && { image_path: file.path, image_name: file.filename, image_size: file.size }) };
};

const getTotalBuyingPrice = async () => {
  const [rows] = await db.query(`
    SELECT SUM(buying_price * quantity) AS total_buying_price 
    FROM products
  `);
  return rows[0].total_buying_price || 0;
};



const deleteProduct = async (id) => {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getTotalBuyingPrice,
  deleteProduct,
};
