// services/product.service.js
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createSale = async (data) => {
  const { customer_id, total_amount, payment_method } = data;

  const [result] = await db.query(
    `INSERT INTO sales (customer_id, total_amount, payment_method)
         VALUES (?, ?, ?)`,
    [customer_id, total_amount, payment_method]
  );

  return { id: result.insertId, ...data };
};

const getAllSales = async () => {
  const [rows] = await db.query(
    "SELECT * FROM sales ORDER BY created_at DESC"
  );
  return rows;
};

const getSaleById = async (id) => {
  const [rows] = await db.query("SELECT * FROM sales WHERE id = ?", [id]);
  return rows[0];
};

const updateSale = async (id, data) => {
  const { customer_id, total_amount, payment_method } = data;

  await db.query(
    `UPDATE sales
       SET customer_id = ?, total_amount = ?, payment_method = ?
       WHERE id = ?`,
    [customer_id, total_amount, payment_method]
  );

  return { id, ...data };
};

const deleteSale = async (id) => {
  await db.query("DELETE FROM sales WHERE id = ?", [id]);
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
