const createSaleItemTable = async (db) => {
  // Create table if it doesn't exist
  await db.query(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sale_id INT,
      product_id INT,
      price DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_id) REFERENCES product_item(id)
    )
  `);

  // Check if 'quantity' column exists
  const [quantityColumn] = await db.query(`
    SHOW COLUMNS FROM sale_items LIKE 'quantity';
  `);

  if (quantityColumn.length === 0) {
    await db.query(`
      ALTER TABLE sale_items
      ADD COLUMN quantity INT DEFAULT 1;
    `);
    console.log("Column 'quantity' added.");
  }

  // Check if 'totalprice' column exists
  const [totalPriceColumn] = await db.query(`
    SHOW COLUMNS FROM sale_items LIKE 'totalprice';
  `);

  if (totalPriceColumn.length === 0) {
    await db.query(`
      ALTER TABLE sale_items
      ADD COLUMN totalprice DECIMAL(10,2) DEFAULT 0;
    `);
    console.log("Column 'totalprice' added.");
  }
};

module.exports = { createSaleItemTable };
