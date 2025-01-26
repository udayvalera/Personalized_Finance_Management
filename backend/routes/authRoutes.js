const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const registerController = require("../controllers/registerController");
const verifyOTPController = require("../controllers/verifyOTPController");
const loginController = require("../controllers/loginController");



router.post('/register', registerController);
router.post('/verify-otp', verifyOTPController);
router.post('/login', loginController);
// router.get("/verify", authController.verify);
// router.get("/login", authController.login);
// router.get("logout", authController.logout);
// router.get("/forgot-password", authController.forgotPassword);
// router.get("/reset-password", authController.resetPassword);
// router.get("/me", authController.me);

module.exports = router;
