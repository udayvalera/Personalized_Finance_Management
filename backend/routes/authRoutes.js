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
const addFinancialInfo = require("../controllers/auth/addInfoController");

//Middlewares
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register", registerController);
router.post("/verify-otp", verifyOTPController);
router.post("/login", loginController);
router.get("/validate-token", validateTokenController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/additional-info", authenticate, addFinancialInfo);
// router.get("/me", authController.me);

module.exports = router;
