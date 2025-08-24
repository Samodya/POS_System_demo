const createRepairSaleTable = async (db) => {
    await db.query(`
    CREATE TABLE IF NOT EXISTS repair_sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceid VARCHAR(50) UNIQUE,
      repair_id INT,
      customer_id INT,
      total_amount DECIMAL(10,2),
      payment_method VARCHAR(50),
      sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repair_id) REFERENCES repairs(id)
      )
    `);
  };
  
  module.exports = { createRepairSaleTable };
  // FOREIGN KEY (customer_id) REFERENCES customers(id)