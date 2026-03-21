const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const getBackendBaseUrl = (req) => {
  if (process.env.RENDER_EXTERNAL_URL) {
    return trimTrailingSlash(process.env.RENDER_EXTERNAL_URL);
  }

  if (process.env.BACKEND_URL) {
    return trimTrailingSlash(process.env.BACKEND_URL);
  }

  if (process.env.GOOGLE_CALLBACK_URL) {
    return trimTrailingSlash(
      process.env.GOOGLE_CALLBACK_URL.replace(/\/auth\/google\/callback\/?$/, ""),
    );
  }

  if (req) {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const forwardedHost = req.headers["x-forwarded-host"];
    const protocol =
      (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) ||
      req.protocol ||
      "http";
    const host =
      (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) ||
      req.get("host");

    if (host) {
      return `${protocol}://${host}`;
    }
  }

  return "http://localhost:3001";
};

const getGoogleCallbackUrl = (req) => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return trimTrailingSlash(process.env.GOOGLE_CALLBACK_URL);
  }

  return `${getBackendBaseUrl(req)}/auth/google/callback`;
};

const hasGoogleOAuthConfig =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

if (hasGoogleOAuthConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getGoogleCallbackUrl(),
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();

          if (!email) {
            return done(new Error("Google account email is required"));
          }

          let user = await userModel.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (!user) {
            user = await userModel.create({
              email,
              fullName:
                profile.displayName ||
                profile.name?.givenName ||
                email.split("@")[0],
              googleId: profile.id,
              authProvider: "google",
            });
          } else {
            let shouldSave = false;

            if (!user.googleId) {
              user.googleId = profile.id;
              shouldSave = true;
            }

            if (!user.authProvider) {
              user.authProvider = "google";
              shouldSave = true;
            }

            if (!user.fullName && profile.displayName) {
              user.fullName = profile.displayName;
              shouldSave = true;
            }

            if (shouldSave) {
              await user.save();
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

module.exports = {
  passport,
  hasGoogleOAuthConfig,
  getGoogleCallbackUrl,
};
