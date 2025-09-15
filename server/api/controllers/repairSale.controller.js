const repairSaleService = require("../services/repair_sale.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const repairSale = await repairSaleService.createRepairSale(data);
        res.status(200).json(repairSale)
    } catch (err) {
         res.status(500).json({error:err})
        console.log(err);
    }
}

const getAll = async (_req, res) => {
    try {
      const repairSale = await repairSaleService.getAllRapairSales();
      res.json(repairSale);
    } catch {
      res.status(500).json({ error: "Failed to get repairs details" });
    }
  };
  
  const getById = async (req, res) => {
    try {
      const repairSale = await repairSaleService.getSaleById(req.params.id);
      if (!repairSale) {
        return res.status(404).json({ error: "Repair Sale not found" });
      }
      res.json(repairSale);
    } catch (error) {
      console.error("getById error:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  const getByRepairId = async (req, res) => {
    try {
      const repairSale = await repairSaleService.getSaleRepairById(req.params.id);
      if (!repairSale) {
        return res.status(404).json({ error: "Repair Sale not found for given repair_id" });
      }
      res.json(repairSale);
    } catch (error) {
      console.error("getByRepairId error:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  const update = async (req, res) => {
    try {
      
      const data = {
        ...req.body,
      };
      const updated = await repairSaleService.updateRepairedSale(req.params.id, data);
      res.json(updated);
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const remove = async (req, res) => {
    try {
      await repairSaleService.deleteRepairedSale(req.params.id);
      res.status(204).json({message:"Customer details deleted"}).end();
    } catch {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };

  module.exports = {
    create, getAll, getById,getByRepairId, update, remove
  }