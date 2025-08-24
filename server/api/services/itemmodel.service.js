const connectMySQLDB = require("../../config"); 

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createItemModel = async (data) => {
    const { modelCode, buyning_Price, dealers_price, selling_price } = data;

    const [result] = await db.query(
        `INSERT INTO itemmodel( modelCode, buying_price, dealers_price, selling_price, added_date) 
        VALUES ( ?, ?, ?, ?, ?)`,
        [modelCode, buyning_Price, dealers_price, selling_price]
    );

    return { id: result.insetId, ...data}
};

const getAllModelCodes = async () => {
    const [rows] = await da.query(`SELECT * FROM itemmodel`);
    return rows
}

const getCustomersById = async (id) => {
    const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
    return rows[0];
  };
  
  const updateCustomer = async (id, data) => {
    const { name, phone, email, address } = data;
  
    await db.query(
      `UPDATE customers
         SET name = ?, phone = ?, email = ?, address = ?
         WHERE id = ?`,
      [name, phone, email, address, id]
    );
  
    return { id, ...data };
  };
  
  const deleteCustomer = async (id) => {
    await db.query("DELETE FROM customers WHERE id = ?", [id]);
  };
  
  module.exports = {
    createItemModel,
    getAllModelCodes,
    getCustomersById,
    updateCustomer,
    deleteCustomer,
  };
  