// services/product.service.js
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();
const createSale = async (data) => {
  const { invoiceid, customer_id, total_amount, payment_method } = data;

  const [result] = await db.query(
    `INSERT INTO sales (invoiceid, customer_id, total_amount, payment_method)
         VALUES (?, ?, ?, ?)`,
    [invoiceid, customer_id, total_amount, payment_method]
  );

  return { id: result.insertId, ...data };
};


const getAllSales = async () => {
  const [rows] = await db.query(`
    SELECT 
      s.*, 
      c.name AS customer_name, 
      c.phone
    FROM sales s
    LEFT JOIN customers c ON c.id = s.customer_id
    ORDER BY s.sale_date DESC
  `);
  return rows;
};



const getSaleById = async (id) => {
  const [rows] = await db.query("SELECT * FROM sales WHERE id = ?", [id]);
  return rows[0];
};

const updateSale = async (id, data) => {
  const { invoiceid, customer_id, total_amount, payment_method } = data;

  await db.query(
    `UPDATE sales
       SET customer_id = ?, total_amount = ?, payment_method = ?
       WHERE id = ?`,
    [invoiceid, customer_id, total_amount, payment_method]
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
