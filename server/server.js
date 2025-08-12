require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMySQLDB = require("./config");
const initModels = require("./api/models/initModels");

const productRoutes = require("./api/routes/product.routes");
const userRoutes = require("./api/routes/user.routes");
const customerRoutes = require("./api/routes/customers.routes");

const app = express();
app.use(cors());
app.use(express.json());



(async () => {
  try {
    const db = await connectMySQLDB();

    // Initialize tables
    await initModels(db);

    app.use('/uploads', express.static('uploads'));

    // Routes
    app.use("/api/products", productRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/customers", customerRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();
