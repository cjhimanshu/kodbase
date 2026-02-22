var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");
const session = require("express-session");
// Import the fs module for error handling without templates
const fs = require("fs");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const connectDB = require("./config/db");

connectDB();

var app = express();

const isProd = process.env.NODE_ENV === "production";
const frontendUrl =
  process.env.FRONTEND_URL || (!isProd ? "http://localhost:5173" : undefined);

// Allow multiple frontend origins
const allowedOrigins = [
  frontendUrl,
  "https://kodbase.vercel.app",
  "https://kodebase.dheerajsonkar.in"
].filter(Boolean);

if (isProd && allowedOrigins.length === 0) {
  console.warn(
    "FRONTEND_URL not set for production; CORS will reject all origins",
  );
}

// mongoose connection is handled in ./config/db.js via connectDB()

// GitHub OAuth configuration
try {
  require("./config/passport-github");
  console.log("GitHub authentication strategy initialized successfully");
} catch (error) {
  console.warn("GitHub strategy initialization error:", error.message);
}

// Google OAuth configuration
try {
  const GoogleStrategy = require("passport-google-oauth20").Strategy;

  const googleCallbackUrl =
    process.env.GOOGLE_CALLBACK_URL ||
    (!isProd ? "http://localhost:3001/auth/google/callback" : undefined);
  if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    googleCallbackUrl
  ) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: googleCallbackUrl,
        },
        function (accessToken, refreshToken, profile, done) {
          console.log("Google profile received");
          return done(null, profile);
        },
      ),
    );
  } else {
    console.warn(
      "Google OAuth not configured; missing client ID/secret or callback URL",
    );
  }
} catch (error) {
  console.warn("Google strategy not available:", error.message);
}

// Facebook OAuth configuration
try {
  const FacebookStrategy = require("passport-facebook").Strategy;

  const facebookCallbackUrl =
    process.env.FACEBOOK_CALLBACK_URL ||
    (!isProd ? "http://localhost:3001/auth/facebook/callback" : undefined);
  if (
    process.env.FACEBOOK_APP_ID &&
    process.env.FACEBOOK_APP_SECRET &&
    facebookCallbackUrl
  ) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: facebookCallbackUrl,
          profileFields: ["id", "displayName", "photos", "email"],
        },
        function (accessToken, refreshToken, profile, done) {
          console.log("Facebook profile received");
          return done(null, profile);
        },
      ),
    );
  } else {
    console.warn(
      "Facebook OAuth not configured; missing app ID/secret or callback URL",
    );
  }
} catch (error) {
  console.warn("Facebook strategy not available:", error.message);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// view engine setup - avoid jade dependency issues
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", function (path, options, callback) {
  fs.readFile(path, "utf-8", callback);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", require("./routes/auth"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler - return JSON instead of rendering views
app.use(function (err, req, res, next) {
  const message = err.message;
  const error = req.app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  res.status(status);
  res.json({
    success: false,
    error: {
      message: message,
      status: status,
    },
  });
});

module.exports = app;
