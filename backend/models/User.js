const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    linkedIn: {
      id: String,
      username: String,
      profilePic: String,
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
    },
    x: {
      id: String,
      username: String,
      profilePic: String,
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
