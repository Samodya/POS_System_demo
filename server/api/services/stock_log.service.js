const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createStockLog = async (data) => {

  const { product_id, model_id, quantity, unit_buying_price, total_amount } =
    data;

  const [result] = await db.query(
    `INSERT INTO stock_order_log 
  (product_id, model_id, quantity, unit_buying_price, total_amount)
   VALUES(?, ?, ?, ?, ?)`,
    [product_id, model_id, quantity, unit_buying_price, total_amount]
  ); 
  
 
};

const createInProductsStockLog = async (data) => {
  const { product_id, model_id, quantity, unit_buying_price, total_amount } =
    data;

  const [result] = await db.query(
    `INSERT INTO stock_order_log 
        (product_id, model_id, quantity, unit_buying_price, total_amount)
        VALUES(?, ?, ?, ?, ?)`,
    [product_id, model_id, quantity, unit_buying_price, total_amount]
  );

  return { id: result.insertId, ...data };
};

const getAllStockLog = async () => {
  const [rows] = await db.query(`
    SELECT * FROM stock_order_log`);
  return rows;
}

module.exports = {
  createStockLog,
  createInProductsStockLog,
  getAllStockLog
};
