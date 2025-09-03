const connectMySQLDB = require("../../config"); 
const { increaseProductQuantity } = require("./product.service");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createStockLog = async (data) => {
    const { product_id, model_id, quantity, unit_buying_price, total_amount } = data;
  
    // Generate invoice_id like STK-YYYYMMDD-0001
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  
    // Count existing logs for today
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM stock_order_log WHERE DATE(created_at) = CURDATE()"
    );
  
    const count = rows[0].count + 1;
    const invoice_id = `STK-${dateStr}-${String(count).padStart(4, "0")}`;
  
    const [result] = await db.query(
      `INSERT INTO stock_order_log 
        (invoice_id, product_id, model_id, quantity, unit_buying_price, total_amount, created_at)
        VALUES(?, ?, ?, ?, ?, ?, NOW())`,
      [invoice_id, product_id, model_id, quantity, unit_buying_price, total_amount]
    );
  
    await increaseProductQuantity(product_id, quantity);
  
    return { id: result.insertId, invoice_id, ...data };
  };
  

module.exports = {
    createStockLog
}

