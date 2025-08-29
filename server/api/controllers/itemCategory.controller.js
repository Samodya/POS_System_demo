const ItemModelService = require("../services/itemCategory.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const repairItem = await ItemModelService.createItemModel(data);
        res.status(200).json(repairItem)
    } catch (err) {
         res.status(500).json({error:err})
        console.log(err);
    }
}

const getAll = async (_req, res) => {
    try {
      const repairItem = await ItemModelService.getItemAllModels();
      res.json(repairItem);
    } catch {
      res.status(500).json({ error: "Failed to get model details" });
    }
  };
  
  const getById = async (req, res) => {
    try {
      const repairItem = await ItemModelService.getItemModelById(req.params.id);
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
      const updated = await ItemModelService.updateItemModel(req.params.id, data);
      res.json(updated);
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const remove = async (req, res) => {
    try {
      await ItemModelService.deleteItemModel(req.params.id);
      res.status(204).json({message:"model details deleted"}).end();
    } catch {
      res.status(500).json({ error: "Failed to delete model" });
    }
  };

  module.exports = {
    create, getAll, getById, update, remove
  }