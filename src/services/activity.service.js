const ActivityLog = require("../models/activityLog.model");

const logActivity = async ({
  projectId,
  action,
  userId,
  username,
  metadata = {}
}) => {
  try {
    await ActivityLog.create({
      projectId,
      action,
      performedBy: {
        userId,
        username
      },
      metadata
    });
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

module.exports = {
  logActivity
};