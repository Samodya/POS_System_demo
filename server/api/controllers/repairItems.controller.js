const repairItemService = require("../services/repairItem.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const repairItem = await repairItemService.createRepairsItem(data);
        res.status(200).json(repairItem)
    } catch (err) {
         res.status(500).json({error:err})
        console.log(err);
    }
}

const getAll = async (_req, res) => {
    try {
      const repairItem = await repairItemService.getAllRepairsItem();
      res.json(repairItem);
    } catch {
      res.status(500).json({ error: "Failed to get repairs details" });
    }
  };

  const getByRepairId =async (req, res) => {
    
    try {
      const repairItem = await repairItemService.getRepairItemByRepairId(req.params.id);
      res.json(repairItem);
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  const getById = async (req, res) => {
    try {
      const repairItem = await repairItemService.getRepairItemById(req.params.id);
      if (!repairItem) return res.status(404).json({ error: "Not found" });
      res.json(repairItem);
    } catch {
      res.status(500).json({ error: "Failed to get Repair" });
    }
  };

  const update = async (req, res) => {
    try {
      
      const data = {
        ...req.body,
      };
      const updated = await repairItemService.updateRepairsItem(req.params.id, data);
      res.json(updated);
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const remove = async (req, res) => {
    try {
      await repairItemService.deleteRepairsItem(req.params.id);
      res.status(204).json({message:"repair details deleted"}).end();
    } catch {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };

  module.exports = {
    create, getAll, getById, getByRepairId, update, remove
  }