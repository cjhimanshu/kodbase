const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const secret = process.env.JWT_SECRET || "your_jwt_secret";

// Note: OAuth authentication has been removed
// Only email/password and guest authentication are supported

module.exports = router;
