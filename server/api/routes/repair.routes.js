const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repair.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", authenticate,repairController.create);
router.put("/:id",authenticate, repairController.update);
router.put("/status_update/:id", repairController.updateStatus);
router.get("/", authenticate, repairController.getAll);
router.get("/:id", authenticate, repairController.getById);
router.delete("/:id", authenticate, repairController.remove);

module.exports = router;