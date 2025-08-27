const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "secret";

const verifyToken = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token provided. Please login again."
    });
  }

  // Handle guest tokens - special case for guest mode users
  if (token.startsWith('guest_')) {
    // Set guest user information in the request
    req.user = {
      userId: "guest",
      email: "guest@example.com",
      isGuest: true,
      guestToken: token // Store the unique guest token for reference
    };
    // Allow the request to proceed
    return next();
  }

  // For regular users, verify the JWT token
  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      isGuest: false
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      msg: "Invalid token signature. Please login again."
    });
  }
};

module.exports = { verifyToken };
