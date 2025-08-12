const createRepairTable = async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(10) unique,
        customer_id INT,
        device VARCHAR(100),
        issue TEXT,
        status ENUM('pending', 'in_progress', 'Awaiting_parts', 'completed') DEFAULT 'pending',
        cost DECIMAL(10,2),
        received_date DATE,
        completed_date DATE,
        assigned_to VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
  };
  
  module.exports = { createRepairTable };
  