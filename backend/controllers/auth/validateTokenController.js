const User = require("../../models/User"); // Import the User model
const { verifyToken } = require("../../utils/jwtUtils"); // Import the verifyToken function from jwtUtils

// Validate token controller
const validateTokenController = async (req, res) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using the verifyToken function from jwtUtils
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data (excluding sensitive information)
    res.status(200).json({
      message: "Token is valid",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        hasFilledAdditionalInfo: user.hasFilledAdditionalInfo,
      },
    });
  } catch (error) {
    console.error("Token validation failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = validateTokenController;
