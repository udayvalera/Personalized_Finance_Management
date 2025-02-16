const User = require('../../models/User');  // Import the User model
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/jwtUtils"); // Import the generateToken function for JWT

// Login controller
const loginController = async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Check if the account is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({
          message: "Account not verified. Please verify your email first.",
        });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token for the user
    const token = generateToken({ userId: user._id, isAdmin: user.isAdmin });

    // Respond with the token and user details (excluding sensitive information)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        hasFilledAdditionalInfo: user.hasFilledAdditionalInfo,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = loginController;
