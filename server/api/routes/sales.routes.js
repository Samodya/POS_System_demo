const express = require("express");
const router = express.Router();
const salesController = require("../controllers/sales.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", authenticate,salesController.create);
router.put("/:id",authenticate, salesController.update);
router.get("/", authenticate, salesController.getAll);
router.get("/:id", authenticate, salesController.getById);
router.delete("/:id", authenticate, salesController.remove);

module.exports = router;