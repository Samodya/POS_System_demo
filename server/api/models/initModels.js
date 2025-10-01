const { createProductTable } = require("./product.model");
const { createCustomerTable } = require("./customer.model");
const { createRepairTable,alteRepairTable } = require("./repair.model");
const { createSaleTable } = require("./sale.model");
const { createSaleItemTable } = require("./saleItem.model");
const { createUserTable } = require("./user.model");
const { createRepairItemTable } = require('./repairItems.model');
const { createRepairSaleTable } = require('./repairSale.model');
const { createInventoryLog, alterInventoryLog } = require('./stockAddingLogs.mode');
const { createProcudtItemTable } = require("./products_item.model");



const initModels = async (db) => {
  await createProductTable(db);
  await createCustomerTable(db);
  await createUserTable(db);
  await createRepairTable(db);
  await createSaleTable(db);
  await createSaleItemTable(db);
  await createRepairItemTable(db);
  await createRepairSaleTable(db);
  await alteRepairTable(db);
  await createInventoryLog(db);
  await alterInventoryLog(db);
  await createProcudtItemTable(db);
};

module.exports = initModels;
