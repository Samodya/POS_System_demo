require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMySQLDB = require("./config");

const productRoutes = require("./api/routes/product.routes"); // your existing routes
const userRoutes = require("./api/routes/user.routes");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    // Connect to MySQL before loading routes
    await connectMySQLDB();

    // Use existing routes
    app.use("/api/products", productRoutes);
    app.use("/api/users", userRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();
