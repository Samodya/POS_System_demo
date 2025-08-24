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

const getModelById = async (id) => {
    const [rows] = await db.query("SELECT * FROM itemmodel WHERE id = ?", [id]);
    return rows[0];
  };
  
  const updateModel = async (id, data) => {
    const { modelCode, buyning_Price, dealers_price, selling_price } = data;
  
    await db.query(
      `UPDATE itemmodel
         SET modelCode = ?, buyning_Price = ?, dealers_price = ?, selling_price = ?
         WHERE id = ?`,
      [ modelCode, buyning_Price, dealers_price, selling_price]
    );
  
    return { id, ...data };
  };
  
  const deleteModel = async (id) => {
    await db.query("DELETE FROM itemmodel WHERE id = ?", [id]);
  };
  
  module.exports = {
    createItemModel,
    getAllModelCodes,
    getModelById,
    updateModel,
    deleteModel,
  };
  