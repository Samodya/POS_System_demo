const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", authenticate,customerController.create);
router.put("/:id",authenticate, customerController.update);
router.get("/", authenticate, customerController.getAll);
router.get("/:id", authenticate, customerController.getById);
router.delete("/:id", authenticate, customerController.remove);

module.exports = router;