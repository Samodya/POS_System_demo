// services/product.service.js
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createRepair = async (data) => {
  const {
    order_id,
    customer_id,
    device,
    issue,
    cost,
    status,
    received_date,
    completed_date,
    assigned_to,
  } = data;

  const [result] = await db.query(
    `INSERT INTO repairs (order_id, customer_id, device, issue,cost, status, received_date, completed_date, assigned_to)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order_id,
      customer_id,
      device,
      issue,
      cost,
      status,
      received_date,
      completed_date,
      assigned_to,
    ]
  );

  return { id: result.insertId, ...data };
};

const getAllRepairs = async () => {
  const [rows] = await db.query(
    `SELECT 
        r.id, 
        r.order_id, 
        r.customer_id, 
        c.name AS customer_name,
        r.device,
        r.issue, 
        r.cost,
        r.status,
        r.received_date,
        r.completed_date,
        u.fullname AS assigned_to, 
        r.repair_fix_note,
        r.created_at
      FROM repairs r
      LEFT JOIN customers c ON r.customer_id = c.id
      LEFT JOIN users u ON r.assigned_to = u.id`
  );
  return rows;
};

const getRepairById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      r.id, 
      r.order_id, 
      c.name AS customer_name, 
      c.phone AS contact_no, 
      r.device, 
      r.issue, 
      r.cost,
      r.status, 
      r.received_date, 
      r.completed_date, 
      r.repair_fix_note, 
      u.fullname AS assigned_to, 
      r.created_at
    FROM repairs r
    LEFT JOIN customers c ON r.customer_id = c.id
    LEFT JOIN users u ON r.assigned_to = u.id
    WHERE r.id = ?
    `,
    [id]
  );
  return rows[0];
};

const updateRepair = async (id, data) => {
  const {
    customer_id,
    device,
    issue,
    status,
    cost,
    received_date,
    completed_date,
    assigned_to,
    repair_fix_note,
  } = data;

  await db.query(
    `UPDATE repairs
       SET customer_id = ?, device = ?, issue = ?, cost=?, status = ?, received_date = ?, completed_date = ?, assigned_to = ?, repair_fix_note= ?
       WHERE id = ?`,
    [
      customer_id,
      device,
      issue,
      status,
      cost,
      received_date,
      completed_date,
      assigned_to,
      repair_fix_note,
      id,
    ]
  );

  return { id, ...data };
};

const updateStatus = async (id, status) => {
  await db.query(
    `UPDATE repairs
       SET status = ?
       WHERE id = ?`,
    [status, id] // both parameters must be provided in order
  );

  return { id, status };
};

const deleteRepair = async (id) => {
  await db.query("DELETE FROM repairs WHERE id = ?", [id]);
};

module.exports = {
  createRepair,
  getAllRepairs,
  getRepairById,
  updateRepair,
  deleteRepair,
  updateStatus,
};
