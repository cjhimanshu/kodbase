var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
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

// Build list of allowed origins (supports multiple comma-separated URLs)
const allowedOrigins = [
  ...(frontendUrl ? frontendUrl.split(",").map((u) => u.trim()) : []),
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOrigin = (origin, callback) => {
  // Allow requests with no origin (Postman, curl, server-to-server)
  if (!origin) return callback(null, true);
  // Allow any vercel.app subdomain
  if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error("Not allowed by CORS"));
};

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
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

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
