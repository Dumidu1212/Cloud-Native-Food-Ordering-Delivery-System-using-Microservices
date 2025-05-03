const jwt = require("jsonwebtoken");
const User = require("./../Models/User");
require("dotenv").config(); 
// 🔐 Verifies and decodes JWT, attaches user to req
const verifyToken = async (req, res, next) => {
  try {
    console.log("Verifying token...");
    // console.log("Request Headers:", req.headers);

    const authHeader = req.headers.authorization;
    //console.log("Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
      console.log();

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
      req.token = token; // for forwarding to internal service requests
      next();

    }catch(err){
      console.error("Token verification error:", err.message);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 🎯 Allows only users with one of the listed roles
const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient role" });
    }
    next();
  };
};

// 👤 Optional shortcut: only allow admins
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

const isDeliveryPerson = (req, res, next) => {
  if (req.user?.role !== "deliveryPerson") {
    return res.status(403).json({ message: "Delivery personnel only" });
  }
  next();
};


module.exports = {
  verifyToken,
  verifyRole,
  isAdmin,
  isDeliveryPerson,
};
