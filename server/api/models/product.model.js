const createProductTable = async (db) => {
  await db.query(`
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    quantity INT DEFAULT 0,
    description TEXT,
    itemmodel_id INT UNIQUE,
    image_path VARCHAR(255),
    image_name VARCHAR(255),
    image_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { createProductTable };


