const salesServices = require("../services/sale.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const sales = await salesServices.createSale(data);
        res.status(200).json(sales)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const getAll = async (_req, res) => {
    try {
      const sales = await salesServices.getAllSales();
      res.json(sales);
    } catch {
      res.status(500).json({ error: "Failed to get sales details" });
    }
  };
  
  const getById = async (req, res) => {
    try {
      const sales = await salesServices.getSaleById(req.params.id);
      if (!sales) return res.status(404).json({ error: "Not found" });
      res.json(sales);
    } catch {
      res.status(500).json({ error: "Failed to get Repair" });
    }
  };

  const update = async (req, res) => {
    try {
      
      const data = {
        ...req.body,
      };
      const updated = await salesServices.updateSale(req.params.id, data);
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update product" });
    }
  };
  
  const remove = async (req, res) => {
    try {
      await salesServices.deleteSale(req.params.id);
      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };

  module.exports = {
    create, getAll, getById, update, remove
  }