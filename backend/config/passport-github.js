const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

// Configure the GitHub strategy for use by Passport - only if credentials are provided
const isProd = process.env.NODE_ENV === "production";
const githubCallbackUrl =
  process.env.GITHUB_CALLBACK_URL ||
  (!isProd ? "http://localhost:3001/auth/github/callback" : undefined);

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  githubCallbackUrl
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: githubCallbackUrl,
        scope: ["user:email"],
      },
      function (accessToken, refreshToken, profile, done) {
        // Log profile for debugging
        console.log(
          "GitHub authentication successful, profile:",
          JSON.stringify(profile),
        );
        return done(null, profile);
      },
    ),
  );
} else {
  console.log(
    "GitHub OAuth strategy not configured - set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL",
  );
}

// These are required for persistent login sessions
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Do not export passport directly, just make sure it's configured
module.exports = GitHubStrategy;
