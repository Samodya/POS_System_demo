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

const getItemModelById = async (id) => {
  const [rows] = await db.query("SELECT * FROM itemmodel WHERE id = ?", [id]);
  return rows[0];
};

const updateItemModel = async (id, itemmodelData) => {
  const { modelCode, buying_price, dealers_price, selling_price, added_date } =
    itemmodelData;

  await db.query(
    `UPDATE itemmodel 
        SET id= ? ,modelCode= ?, buying_price = ? ,dealers_price= ? ,selling_price= ? ,added_date= ? 
        WHERE id = ?`,
    [modelCode, buying_price, dealers_price, selling_price, added_date]
  );

  

  return { id, ...itemmodelData };
};

const deleteItemModel = async (id) => {
    await db.query("DELETE FROM itemmodel WHERE id = ?", [id]);
  };

module.exports = {
  createItemModel,
  getItemAllModels,
  getItemModelById,
  updateItemModel,
  deleteItemModel
};
