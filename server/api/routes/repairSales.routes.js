const express = require("express");
const router = express.Router();
const repairSalesController = require("../controllers/repairSale.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", repairSalesController.create);
router.put("/:id", repairSalesController.update);
router.get("/repair/:id", repairSalesController.getByRepairId)
router.get("/",repairSalesController.getAll);
router.get("/:id", repairSalesController.getById);
router.delete("/:id", repairSalesController.remove);

module.exports = router;