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
      FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
};

const alterInventoryLog = async (db) => {
  try {
    const [columns] = await db.query(`
    SHOW COLUMNS FROM stock_order_log LIKE 'invoiceid';
  `);

    if (columns.length > 0) {
      await db.query(`
        ALTER TABLE stock_order_log
        DROP INDEX invoiceid;
      `);
    }

  

    console.log(
      "Invoice ID column and its unique constraint dropped successfully."
    );
  } catch (error) {
    console.error("Error altering the table:", error);
  }
};

module.exports = { createInventoryLog, alterInventoryLog };
