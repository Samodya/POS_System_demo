// services/product.service.js
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createRepairsItem = async (data) => {
  const { repair_id, product_id, quantity, price } = data;

  const [result] = await db.query(
    `INSERT INTO repair_items (repair_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
    [repair_id, product_id, quantity, price]
  );

  return { id: result.insertId, ...data };
};

const getAllRepairsItem = async () => {
  const [rows] = await db.query(
    "SELECT * FROM repair_items ORDER BY created_at DESC"
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
    const [rows] = await db.query("SELECT * FROM repair_items WHERE repair_id = ?", [
      repair_id,
    ]);
    return rows;
  };

const updateRepairsItem = async (id, data) => {
  const { repair_id, product_id, quantity, price } = data;

  await db.query(
    `UPDATE repair_items
       SET repair_id = ?, product_id = ?, quantity = ?, price = ?
       WHERE id = ?`,
    [repair_id, product_id, quantity, price]
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
