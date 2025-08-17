// services/product.service.js
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createCustomer = async (data) => {
  const { name, phone, email, address } = data;

  const [result] = await db.query(
    `INSERT INTO customers (name, phone, email, address)
       VALUES (?, ?, ?, ?)`,
    [name, phone, email, address]
  );

  return { id: result.insertId, ...data };
};

const getAllCustomers = async () => {
  const [rows] = await db.query("SELECT * FROM customers ORDER BY name DESC");
  return rows;
};

const getCustomersById = async (id) => {
  const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
  return rows[0];
};

const updateCustomer = async (id, data) => {
  const { name, phone, email, address } = data;

  await db.query(
    `UPDATE customers
       SET name = ?, phone = ?, email = ?, address = ?
       WHERE id = ?`,
    [name, phone, email, address, id]
  );

  return { id, ...data };
};

const deleteCustomer = async (id) => {
  await db.query("DELETE FROM customers WHERE id = ?", [id]);
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomersById,
  updateCustomer,
  deleteCustomer,
};
