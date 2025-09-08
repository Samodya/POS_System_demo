// services/product.service.js
const connectMySQLDB = require("../../config");
const { reduceProductQuantity } = require("./product.service");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createRepairsItem = async (data) => {
  const { repair_id, product_id, quantity, price, total_amount } = data;

  const [result] = await db.query(
    `INSERT INTO repair_items (repair_id, product_id, quantity, price, total_amount)
         VALUES (?, ?, ?, ?, ?)`,
    [repair_id, product_id, quantity, price, total_amount]
  );

  reduceProductQuantity(product_id, quantity);

  return { id: result.insertId, ...data };
};

const getAllRepairsItem = async () => {
  const [rows] = await db.query(
    `SELECT rt.repair_id, p.name, rt.quantity, rt.price, rt.total_amount 
    FROM repair_items rt 
    LEFT JOIN products p ON p.id = rt.product_id ORDER BY created_at DESC`
  );
  return rows;
};

const getRepairItemById = async (id) => {
  const [rows] = await db.query("SELECT * FROM repair_items WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

const getRepairItemByRepairId = async (repair_id) => {
  const [rows] = await db.query(
    `SELECT rt.repair_id, p.name, rt.quantity, rt.price, rt.total_amount 
    FROM repair_items rt 
    LEFT JOIN products p ON p.id = rt.product_id WHERE rt.repair_id = ?`,
    [repair_id]
  );
  return rows;
};

const updateRepairsItem = async (id, data) => {
  const { repair_id, product_id, quantity, price, total_amount } = data;

  await db.query(
    `UPDATE repair_items
       SET repair_id = ?, product_id = ?, quantity = ?, price = ?, total_amount=?
       WHERE id = ?`,
    [repair_id, product_id, quantity, price, total_amount, id]
  );

  return { id, ...data };
};

const deleteRepairsItem = async (id) => {
  await db.query("DELETE FROM sale_items WHERE id = ?", [id]);
};

module.exports = {
  createRepairsItem,
  getAllRepairsItem,
  getRepairItemByRepairId,
  getRepairItemById,
  updateRepairsItem,
  deleteRepairsItem,
};
