const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.put("/change-password", authenticate, userController.changePassword);
router.put("/:id", authenticate, roleCheck("admin"), userController.updateUser);
router.delete("/:id", authenticate, roleCheck("admin"), userController.deleteUser);
router.get("/", authenticate, roleCheck("admin"), userController.getAllUsers);

module.exports = router;
