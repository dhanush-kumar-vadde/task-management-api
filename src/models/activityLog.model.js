const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    action: {
      type: String,
      required: true
    },

    performedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      username: {
        type: String
      }
    },

    target: {
      type: String,
      default: null
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);