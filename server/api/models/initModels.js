const { createProductTable, alterProductTable } = require("./product.model");
const { createCustomerTable } = require("./customer.model");
const { createRepairTable,alteRepairTable } = require("./repair.model");
const { createSaleTable } = require("./sale.model");
const { createSaleItemTable } = require("./saleItem.model");
const { createUserTable } = require("./user.model");
const { createItemModelTable } = require('./itemcategory.model');
const { createRepairItemTable } = require('./repairItems.model');
const { createRepairSaleTable } = require('./repairSale.model');


const initModels = async (db) => {
  await createProductTable(db);
  await createCustomerTable(db);
  await createUserTable(db);
  await createRepairTable(db);
  await createSaleTable(db);
  await createSaleItemTable(db);
  await createItemModelTable(db);
  await createRepairItemTable(db);
  await createRepairSaleTable(db);
  await alterProductTable(db);
  await alteRepairTable(db);
};

module.exports = initModels;
