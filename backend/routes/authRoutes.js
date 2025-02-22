const express = require("express");
const router = express.Router();
// const authController = require("../controllers/authController");
const registerController = require("../controllers/auth/registerController");
const verifyOTPController = require("../controllers/auth/verifyOTPController");
const loginController = require("../controllers/auth/loginController");
const validateTokenController = require("../controllers/auth/validateTokenController");
const {
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth/forgetPasswordController");

router.post("/register", registerController);
router.post("/verify-otp", verifyOTPController);
router.post("/login", loginController);
router.get("/validate-token", validateTokenController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
// router.get("/me", authController.me);

module.exports = router;
