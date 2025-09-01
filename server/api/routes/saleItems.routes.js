const express = require("express");
const router = express.Router();
const saleItemsController = require("../controllers/saleItem.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", authenticate,saleItemsController.create);
router.put("/:id",authenticate, saleItemsController.update);
router.get("/saleid/:id", authenticate, saleItemsController.getBySaleId);
router.get("/", authenticate, saleItemsController.getAll);
router.get("/:id", authenticate, saleItemsController.getById);
router.delete("/:id", authenticate, saleItemsController.remove);

module.exports = router;