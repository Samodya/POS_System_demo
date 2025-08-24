// services/product.service.js
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createRepairSale = async (data) => {
  const { invoiceid, repair_id, customer_id, total_amount, payment_method } = data;

  const [result] = await db.query(
    `INSERT INTO repair_sales (invoiceid, repair_id,customer_id, total_amount, payment_method)
         VALUES (?, ?, ?, ?, ?)`,
    [invoiceid, repair_id, customer_id, total_amount, payment_method]
  );

  return { id: result.insertId, ...data };
};

const getAllRapairSales = async () => {
  const [rows] = await db.query(
    "SELECT * FROM repair_sales ORDER BY sale_date DESC"
  );
  return rows;
};

const getSaleRepairedById = async (id) => {
  const [rows] = await db.query("SELECT * FROM repair_sales WHERE id = ?", [id]);
  return rows[0];
};

const updateRepairedSale = async (id, data) => {
  const { invoiceid, repair_id, customer_id, total_amount, payment_method } = data;

  await db.query(
    `UPDATE repair_sales
       SET invoiceid=?, repair_id=?, customer_id = ?, total_amount = ?, payment_method = ?
       WHERE id = ?`,
    [invoiceid, repair_id, customer_id, total_amount, payment_method]
  );

  return { id, ...data };
};

const deleteRepairedSale = async (id) => {
  await db.query("DELETE FROM repair_sales WHERE id = ?", [id]);
};

module.exports = {
  createRepairSale,
  getAllRapairSales,
  getSaleRepairedById,
  updateRepairedSale,
  deleteRepairedSale,
};
