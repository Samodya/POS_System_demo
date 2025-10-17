const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middleware/imageupload");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", upload.single("image"), productController.create);
router.put("/:id", upload.single("image"), productController.update);
router.get("/", productController.getAll);
router.get("/:id", authenticate, productController.getById);
router.delete("/:id", authenticate, productController.remove);


module.exports = router;
