const createProductTable = async (db) => {
  await db.query(`
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    buying_price DECIMAL(10,2) NOT NULL,
    retail_price DECIMAL(10,2) NOT NULL,
    dealers_price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 0,
    description TEXT,
    warranty_period VARCHAR(50),
    conditions VARCHAR(50),
    serial_no VARCHAR(50) UNIQUE,
    image_path VARCHAR(255),
    image_name VARCHAR(255),
    image_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};


const alterProductTable = async (db) => {
  // Check if column exists
  const [columns] = await db.query(`
    SHOW COLUMNS FROM products LIKE 'itemmodel_id';
  `);

  if (columns.length === 0) {
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN itemmodel_id INT;
    `);
  }

  const [columns1] = await db.query(`
    SHOW COLUMNS FROM products LIKE 'warranty';
  `);

  if (columns1.length === 0) {
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN warranty VARCHAR(50);
    `);
  }

  const [columns2] = await db.query(`
    SHOW COLUMNS FROM products LIKE 'conditions';
  `);

  if (columns2.length === 0) {
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN conditions VARCHAR(50);
    `);
  }

  const [columns3] = await db.query(`
    SHOW COLUMNS FROM products LIKE 'serial_no';
  `);

  if (columns3.length === 0) {
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN serial_no VARCHAR(50) UNIQUE;
    `);
  }

};

module.exports = { createProductTable, alterProductTable };


