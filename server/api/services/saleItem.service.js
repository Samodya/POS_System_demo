// services/product.service.js
const connectMySQLDB = require("../../config");
const { reduceProductQuantity } = require("./product.service");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();

const createSalesItem = async (data) => {
  const {
    sale_id,
    product_id,
    quantity,
    price,
    totalprice
  } = data;

  const [result] = await db.query(
    `INSERT INTO sale_items (sale_id, product_id, quantity, price, totalprice)
         VALUES (?, ?, ?, ?, ?)`,
    [
        sale_id,
        product_id,
        quantity,
        price,
        totalprice
    ]
  );

  await reduceProductQuantity(product_id,quantity)

  return { id: result.insertId, ...data };
};

const getAllSalesItem = async () => {
    const [rows] = await db.query("SELECT * FROM sale_items ORDER BY created_at DESC");
    return rows;
  };
  
  const getSaleItemById = async (id) => {
    const [rows] = await db.query("SELECT * FROM sale_items WHERE id = ?", [id]);
    return rows[0];
  };
  
  const updateSaleItem = async (id, data) => {
    const {
        sale_id,
        product_id,
        quantity,
        price
    } = data;
  
    await db.query(
      `UPDATE sale_items
       SET sale_id = ?, product_id = ?, quantity = ?, price = ?
       WHERE id = ?`,
      [ sale_id,
        product_id,
        quantity,
        price]
    );
  
    return { id, ...data };
  };
  
  const deleteSalesItem = async (id) => {
    await db.query("DELETE FROM sale_items WHERE id = ?", [id]);
  };


module.exports = {
  createSalesItem,
  getAllSalesItem,
  getSaleItemById,
  updateSaleItem,
  deleteSalesItem
};
