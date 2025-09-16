const express = require("express");
const router = express.Router();
const stockLogController = require("../controllers/stock_log.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", stockLogController.create);
// router.put("/:id", repairItemsController.update);
// router.get("/repair/:id",repairItemsController.getByRepairId);
router.get("/",stockLogController.getAll);
// router.get("/:id", repairItemsController.getById);
// router.delete("/:id", repairItemsController.remove);

module.exports = router;