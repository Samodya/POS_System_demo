const createRepairItemTable = async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS repair_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        repair_id INT,
        product_id INT,
        quantity INT,
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (repair_id) REFERENCES repairs(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
  };
  
  module.exports = { createRepairItemTable };
  