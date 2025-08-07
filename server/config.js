// config/db.js
const mysql = require("mysql2/promise");

let pool = null;

const connectMySQLDB = async () => {
  if (pool) return pool; // ✅ already connected

  try {
    // Step 1: Create temp connection (no DB yet)
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    // Step 2: Ensure database exists
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\``
    );
    await connection.end();

    // Step 3: Create pool with DB selected
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("✅ MySQL connected via pool");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectMySQLDB;
