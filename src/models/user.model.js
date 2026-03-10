const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
    type: String,
    required: true,
    trim: true
    },
        
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    platformRole: {
      type: String,
      enum: ["USER", "PLATFORM_ADMIN", "SUPER_ADMIN"],
      default: "USER"
    },

    verified: {
      type: Boolean,
      default: false
    },

    deleted: {
      type: Boolean,
      default: false
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);