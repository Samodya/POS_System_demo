const createRepairTable = async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(10) unique,
        customer_id INT,
        device VARCHAR(100),
        issue TEXT,
        status ENUM('pending', 'in_progress', 'Awaiting_parts', 'completed', 'Delivered') DEFAULT 'pending',
        cost DECIMAL(10,2),
        received_date DATE,
        completed_date DATE,
        assigned_to VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
  };
  const alteRepairTable = async (db) => {
    // Remove `cost` column if it exists
    // const [columns] = await db.query(`
    //   SHOW COLUMNS FROM repairs LIKE 'cost';
    // `);
  
    // if (columns.length > 0) {
    //   await db.query(`
    //     ALTER TABLE repairs 
    //     DROP COLUMN cost;
    //   `);
    // }
  
    // Check if `repair_fix_note` column exists
    const [fixNoteColumn] = await db.query(`
      SHOW COLUMNS FROM repairs LIKE 'repair_fix_note';
    `);
  
    if (fixNoteColumn.length === 0) {
      await db.query(`
        ALTER TABLE repairs 
        ADD COLUMN repair_fix_note INT;
      `);
    }
  };
  
   
  
  module.exports = { createRepairTable, alteRepairTable, };
  