const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { passport, hasGoogleOAuthConfig } = require("../config/passport-google");
require("dotenv").config();

const secret = process.env.JWT_SECRET || "your_jwt_secret";
const frontendUrl = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")[0]
  .trim();

router.get("/google", (req, res, next) => {
  if (!hasGoogleOAuthConfig) {
    return res.redirect(
      `${frontendUrl}/login?error=google_auth_not_configured`,
    );
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  if (!hasGoogleOAuthConfig) {
    return res.redirect(
      `${frontendUrl}/login?error=google_auth_not_configured`,
    );
  }

  return passport.authenticate(
    "google",
    { session: false },
    (err, user) => {
      if (err || !user) {
        return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        secret,
        {
          expiresIn: "24h",
          algorithm: "HS256",
        },
      );

      return res.redirect(
        `${frontendUrl}/login?token=${encodeURIComponent(token)}&fullName=${encodeURIComponent(user.fullName)}`,
      );
    },
  )(req, res, next);
});

module.exports = router;
