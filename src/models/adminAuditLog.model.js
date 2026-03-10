const mongoose = require("mongoose");

const adminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      required: true
    },

    targetType: {
      type: String,
      enum: ["USER", "PROJECT", "TASK"],
      required: false
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId
    },

    metadata: Object
    
    },
  { timestamps: true }
);

module.exports = mongoose.model("AdminAuditLog", adminAuditLogSchema);