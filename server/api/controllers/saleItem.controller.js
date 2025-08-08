const salesItemServices = require("../services/saleItem.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const salesItem = await salesItemServices.salesItemServices(data);
        res.status(200).json(salesItem)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const getAll = async (_req, res) => {
    try {
      const saleitems = await salesItemServices.getAllSalesItem();
      res.json(saleitems);
    } catch {
      res.status(500).json({ error: "Failed to get repairs details" });
    }
  };
  
  const getById = async (req, res) => {
    try {
      const saleItem = await salesItemServices.getSaleItemById(req.params.id);
      if (!saleItem) return res.status(404).json({ error: "Not found" });
      res.json(saleItem);
    } catch {
      res.status(500).json({ error: "Failed to get Repair" });
    }
  };

  const update = async (req, res) => {
    try {
      
      const data = {
        ...req.body,
      };
      const updated = await salesItemServices.updateSaleItem(req.params.id, data);
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update product" });
    }
  };
  
  const remove = async (req, res) => {
    try {
      await salesItemServices.deleteSalesItem(req.params.id);
      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };

  module.exports = {
    create, getAll, getById, update, remove
  }