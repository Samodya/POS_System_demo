const createItemModelTable = async (db) => {
    await db.query(`
    CREATE TABLE IF NOT EXISTS ItemModel (
      id INT AUTO_INCREMENT PRIMARY KEY,
      modelCode VARCHAR(50) UNIQUE,
      buying_price DECIMAL(10,2),
      dealers_price DECIMAL(10,2),
      selling_price DECIMAL(10,2),
      added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  };
  
  module.exports = { createItemModelTable };
  // FOREIGN KEY (customer_id) REFERENCES customers(id)