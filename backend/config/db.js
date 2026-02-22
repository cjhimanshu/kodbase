const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/codeIDE";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Handle disconnection and auto-reconnect
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Reconnecting...");
  setTimeout(connectDB, 5000);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error event:", err);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

module.exports = connectDB;
