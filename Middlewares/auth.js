require("dotenv").config();
const jwt = require("jsonwebtoken");

//  Verifies the token from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains id, name, role
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

//  Checks if the user's role matches required roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
