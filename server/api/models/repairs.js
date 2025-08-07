const createRepairTable = async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_no VARCHAR(50) NOT NULL UNIQUE,
        device_type VARCHAR(100),
        issue_description TEXT,
        status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
        priority ENUM('urgent', 'not urgent') DEFAULT 'not urgent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  };
  
  module.exports = { createRepairTable };
  