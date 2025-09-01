const repairServices = require("../services/repair.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const repair = await repairServices.createRepair(data);
        res.status(200).json(repair)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const getAll = async (_req, res) => {
    try {
      const repairs = await repairServices.getAllRepairs();
      res.json(repairs);
    } catch {
      res.status(500).json({ error: "Failed to get repairs details" });
    }
  };
  
  const getById = async (req, res) => {
    try {
      const repairs = await repairServices.getRepairById(req.params.id);
      if (!repairs) return res.status(404).json({ error: "Not found" });
      res.json(repairs);
    } catch {
      res.status(500).json({ error: "Failed to get Repair" });
    }
  };

  const update = async (req, res) => {
    try {
      
      const data = {
        
        ...req.body,
      };
      const updated = await repairServices.updateRepair(req.params.id, data);
      res.json(updated);
    } catch (error){
      res.status(500).json({ error: error });
      console.log(error);
    }
  };
  
  const remove = async (req, res) => {
    try {
      await repairServices.deleteRepair(req.params.id);
      res.status(204).end();
    } catch (error){
      res.status(500).json({ error: error });
      console.log(error);
    }
  };

  const updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const [result] = await db.query(
        `UPDATE repairs SET status = ? WHERE id = ?`,
        [status, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Repair not found" });
      }
  
      return res.json({ id, status, message: "Status updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = {
    create, getAll, getById, update, remove, updateStatus
  }