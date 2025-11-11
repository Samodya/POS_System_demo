const bcrypt = require('bcrypt');

const createUserTable = async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(120) NOT NULL,
        phone INT,
        email VARCHAR(30),
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'cashier', 'technician') DEFAULT 'cashier',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  

  const [rows] = await db.query('SELECT COUNT(*) as userCount FROM users');
  const userCount = rows[0].userCount;

  if (userCount === 0) {
    console.log("Users table is empty. Creating default admin...");
  

   const adminUsername = 'admin';
  const adminEmail = 'admin@email.com';
  const plainPassword = 'admin123';
  const adminRole = 'admin';
  const adminFullname = 'Default Admin'; // Added a default fullname


  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const insertAdminQuery = `
    INSERT IGNORE INTO users 
      (fullname, email, username, password, role) 
    VALUES 
      (?, ?, ?, ?, ?)
  `;

  // 5. Execute the insert query with the admin data
  await db.query(insertAdminQuery, [
    adminFullname,
    adminEmail,
    adminUsername,
    hashedPassword,
    adminRole
  ]);
  
  console.log("User table checked/created. Default admin checked/created.");
  // --- New Code Ends Here ---
};
}
  
  module.exports = { createUserTable };
  