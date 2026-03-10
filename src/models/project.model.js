const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    username: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["OWNER", "MANAGER", "MEMBER"],
      default: "MEMBER"
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [memberSchema],

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

projectSchema.index(
  { _id: 1, "members.userId": 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model("Project", projectSchema);