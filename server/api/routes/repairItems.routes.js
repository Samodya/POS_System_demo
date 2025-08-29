const express = require("express");
const router = express.Router();
const repairItemsController = require("../controllers/repairItems.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", repairItemsController.create);
router.put("/:id", repairItemsController.update);
router.get("/",repairItemsController.getAll);
router.get("/:id", repairItemsController.getById);
router.delete("/:id", repairItemsController.remove);

module.exports = router;