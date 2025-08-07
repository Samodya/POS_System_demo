// services/product.service.js
const connectMySQLDB = require("../../config"); 

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createUser = async ({ username, password, role }) => {
  const [result] = await db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role || "cashier"]
  );
  return { id: result.insertId, username, role };
};

const findUserByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

const updateUser = async (id, { username, role }) => {
  await db.query("UPDATE users SET username = ?, role = ? WHERE id = ?", [username, role, id]);
};

const changePassword = async (id, hashedPassword) => {
  await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
};

const deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};

const getAllUsers = async () => {
  const [rows] = await db.query("SELECT id, username, role, created_at FROM users");
  return rows;
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  updateUser,
  changePassword,
  deleteUser,
  getAllUsers,
};
