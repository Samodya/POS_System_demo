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
    status,
    cost,
    received_date,
    completed_date,
    assigned_to,
  } = data;

  const [result] = await db.query(
    `INSERT INTO repairs (order_id, customer_id, device, issue, status, cost, received_date, completed_date, assigned_to)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order_id,
      customer_id,
      device,
      issue,
      status,
      cost,
      received_date,
      completed_date,
      assigned_to
    ]
  );

  return { id: result.insertId, ...data };
};

const getAllRepairs = async () => {
    const [rows] = await db.query("SELECT r.id, r.order_id, c.name AS customer_name,r.device,r.issue, r.status,r.cost,r.received_date,r.completed_date,u.fullname AS assigned_to, r.created_at FROM repairs r LEFT JOIN customers c ON r.customer_id = c.id LEFT JOIN users u ON r.assigned_to = u.id");
    return rows;
  };
  
  const getRepairById = async (id) => {
    const [rows] = await db.query("SELECT * FROM repairs WHERE id = ?", [id]);
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
    } = data;
  
    await db.query(
      `UPDATE repairs
       SET customer_id = ?, device = ?, issue = ?, status = ?, cost = ?, received_date = ?, completed_date = ?, assigned_to = ?
       WHERE id = ?`,
      [ customer_id,
        device,
        issue,
        status,
        cost,
        received_date,
        completed_date,
        assigned_to,]
    );
  
    return { id, ...data };
  };
  
  const deleteRepair = async (id) => {
    await db.query("DELETE FROM repairs WHERE id = ?", [id]);
  };


module.exports = {
  createRepair,
  getAllRepairs,
  getRepairById,
  updateRepair,
  deleteRepair
};
