const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, default: false, required: false },
    phone: { type: String, required: false },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    challenge: { type: String, default: null },
    credential: {
      type: {
        id: String,
        publicKey: Buffer,
        createAt: Date,
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
