const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret";

const verifyToken = (req, res, next) => {
  // Accept token from Authorization header (Bearer), request body, or query
  let token = null;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (
    authHeader &&
    typeof authHeader === "string" &&
    authHeader.startsWith("Bearer ")
  ) {
    token = authHeader.slice(7);
  } else if (req.body && req.body.token) {
    token = req.body.token;
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token provided. Please login again.",
    });
  }

  // Handle guest tokens - special case for guest mode users
  if (typeof token === "string" && token.startsWith("guest_")) {
    req.user = {
      userId: "guest",
      email: "guest@example.com",
      isGuest: true,
      guestToken: token,
    };
    return next();
  }

  // For regular users, verify the JWT token
  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      isGuest: false,
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      msg: "Invalid token signature. Please login again.",
    });
  }
};

module.exports = { verifyToken };
