const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

// Configure the Facebook strategy for use by Passport - only if credentials are provided
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL ||
          "http://localhost:3001/auth/facebook/callback",
        profileFields: ["id", "displayName", "name", "emails", "photos"], // Request these fields
        enableProof: true,
      },
      function (accessToken, refreshToken, profile, done) {
        // Log profile for debugging
        console.log(
          "Facebook authentication successful, profile:",
          JSON.stringify(profile),
        );
        return done(null, profile);
      },
    ),
  );
} else {
  console.log(
    "Facebook OAuth strategy not configured - set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET",
  );
}

module.exports = passport;
