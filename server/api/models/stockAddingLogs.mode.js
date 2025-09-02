const createInventoryLog = async (db) => {
    await db.query(`
    CREATE TABLE IF NOT EXISTS stock_order_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceid VARCHAR(50) UNIQUE,
      product_id INT,
      model_id INT, 
      quantity INT,
      unit_buying_price DECIMAL(10,2),
      total_amount DECIMAL(10,2),
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (model_id) REFERENCES ItemModel(id)
      )
    `);
  };
  
  module.exports = { createInventoryLog };