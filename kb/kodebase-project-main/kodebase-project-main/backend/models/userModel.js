const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  githubId: {
    type: String,
    default: null,
    sparse: true  // Only index non-null values
  },
  googleId: {
    type: String,
    default: null,
    sparse: true  // Only index non-null values
  },
  facebookId: {
    type: String,
    default: null,
    sparse: true  // Only index non-null values
  },
  name: {
    type: String
  },
  resetPasswordCode: String,
  resetPasswordExpires: Date,
  date: {
    type: Date,
    default: Date.now,
  }
});

// Create unique indexes only on non-null values to avoid the duplicate key error
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ facebookId: 1 }, { sparse: true });
userSchema.index({ githubId: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);