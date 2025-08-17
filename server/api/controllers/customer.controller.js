const customerService = require("../services/customer.service");

const create = async (req,res) => {
    try {
        const data = {
            ...req.body,
          };

        const customer = await customerService.createCustomer(data);
        res.status(200).json(customer)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const getAll = async (_req, res) => {
    try {
      const customers = await customerService.getAllCustomers();
      res.json(customers);
    } catch {
      res.status(500).json({ error: "Failed to get repairs details" });
    }
  };
  
  const getById = async (req, res) => {
    try {
      const customers = await customerService.getCustomersById(req.params.id);
      if (!customers) return res.status(404).json({ error: "Not found" });
      res.json(customers);
    } catch {
      res.status(500).json({ error: "Failed to get Repair" });
    }
  };

  const update = async (req, res) => {
    try {
      
      const data = {
        ...req.body,
      };
      const updated = await customerService.updateCustomer(req.params.id, data);
      res.json(updated);
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const remove = async (req, res) => {
    try {
      await customerService.deleteCustomer(req.params.id);
      res.status(204).json({message:"Customer details deleted"}).end();
    } catch {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };

  module.exports = {
    create, getAll, getById, update, remove
  }