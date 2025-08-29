const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB();
})();

const createItemModel = async (itemmodelData) => {
  const { modelCode, buying_price, dealers_price, selling_price, added_date } =
    itemmodelData;

  const query = `INSERT INTO 
    itemmodel(modelCode, buying_price, dealers_price, selling_price, added_date) 
    VALUES (?, ?, ?, ?, ?)`;

  const values = [
    modelCode,
    buying_price,
    dealers_price,
    selling_price,
    added_date,
  ];

  const [result] = await db.query(query, values);

  return { id: result.insertId, ...itemmodelData };
};

const getItemAllModels = async () => {
  const [rows] = await db.query(
    "SELECT * FROM itemmodel ORDER BY added_date DESC"
  );
  return rows;
};

module.exports = {
  createItemModel,
  getItemAllModels,
};
