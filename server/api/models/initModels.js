const { createProductTable } = require("./product.model");
const { createCustomerTable } = require("./customer.model");
const { createRepairTable } = require("./repair.model");
const { createSaleTable } = require("./sale.model");
const { createSaleItemTable } = require("./saleItem.model");
const { createUserTable } = require("./user.model");

const initModels = async (db) => {
  await createProductTable(db);
  await createCustomerTable(db);
  await createUserTable(db);
  await createRepairTable(db);
  await createSaleTable(db);
  await createSaleItemTable(db);
};

module.exports = initModels;
