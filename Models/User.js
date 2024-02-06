const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetToken: {
      // Add this field for password reset token
      type: String,
    },
    resetTokenExpiration: {
      // Add this field for token expiration
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
