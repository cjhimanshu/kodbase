const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  passport,
  hasGoogleOAuthConfig,
  getGoogleCallbackUrl,
} = require("../config/passport-google");
require("dotenv").config();

const secret = process.env.JWT_SECRET || "your_jwt_secret";
const frontendUrl = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")[0]
  .trim();
const redirectWithError = (res, errorCode, detail) => {
  const params = new URLSearchParams({ error: errorCode });

  if (detail) {
    params.set("error_detail", detail.slice(0, 180));
  }

  return res.redirect(`${frontendUrl}/login?${params.toString()}`);
};

router.get("/google", (req, res, next) => {
  if (!hasGoogleOAuthConfig) {
    return redirectWithError(
      res,
      "google_auth_not_configured",
      "Google OAuth environment variables are missing.",
    );
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
    callbackURL: getGoogleCallbackUrl(req),
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  if (!hasGoogleOAuthConfig) {
    return redirectWithError(
      res,
      "google_auth_not_configured",
      "Google OAuth environment variables are missing.",
    );
  }

  return passport.authenticate(
    "google",
    { session: false, callbackURL: getGoogleCallbackUrl(req) },
    (err, user) => {
      if (err || !user) {
        const detail = err?.message || "No user returned from Google auth";

        console.error("Google auth callback failed:", {
          message: detail,
          stack: err?.stack,
          name: err?.name,
          hasUser: Boolean(user),
        });
        return redirectWithError(res, "google_auth_failed", detail);
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

router.get("/google/status", (req, res) => {
  res.json({
    configured: hasGoogleOAuthConfig,
    hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
    hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    callbackUrl: getGoogleCallbackUrl(req),
    frontendUrl,
  });
});

module.exports = router;
