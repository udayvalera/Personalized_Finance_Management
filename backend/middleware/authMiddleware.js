const { verifyToken } = require("../utils/jwtUtils");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Token is not valid" });
  }

  req.user = { id: decoded.userId }; // Set req.user.id
  console.log(req.user.id);
  next();
};

module.exports = { authenticate };
