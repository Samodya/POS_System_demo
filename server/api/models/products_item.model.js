const createProcudtItemTable = async (db) => {
  await db.query(`
      CREATE TABLE IF NOT EXISTS product_item (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial_no VARCHAR(10) unique,
        buying_price DECIMAL(10,2) NOT NULL,
        retail_price DECIMAL(10,2) NOT NULL,
        dealers_price DECIMAL(10,2) NOT NULL,
        warranty_period VARCHAR(50),
        item_status VARCHAR(20),
        conditions VARCHAR(50),
        product_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
};

module.exports = {
    createProcudtItemTable
}
