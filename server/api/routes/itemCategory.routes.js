const express = require("express");
const router = express.Router();
const itemmodelController = require("../controllers/itemCategory.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", itemmodelController.create);
router.put("/:id", itemmodelController.update);
router.get("/",itemmodelController.getAll);
router.get("/:id", itemmodelController.getById);
router.delete("/:id", itemmodelController.remove);

module.exports = router;