require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMySQLDB = require("./config");
const initModels = require("./api/models/initModels");

const productRoutes = require("./api/routes/product.routes");
const userRoutes = require("./api/routes/user.routes");
const customerRoutes = require("./api/routes/customers.routes");
const repairRoutes = require("./api/routes/repair.routes");
const saleRoutes = require("./api/routes/sales.routes");
const saleItemsRoutes = require("./api/routes/saleItems.routes");
const repairItemsRoutes = require("./api/routes/repairItems.routes");
const repairSaleRoutes = require("./api/routes/repairSales.routes");
const pdfRoutes = require("./api/routes/pdf_gen.routes");

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
    app.use("/api/repairs",repairRoutes);
    app.use("/api/sales", saleRoutes);
    app.use("/api/saleitems",saleItemsRoutes);
    app.use("/api/repair-items",repairItemsRoutes);
    app.use("/api/repair-sales", repairSaleRoutes);
    app.use("/api/reports", pdfRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();
