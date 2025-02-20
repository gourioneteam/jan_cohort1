const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/register", authController.registerAdmin);
router.post("/login", authController.login);

module.exports = router;
