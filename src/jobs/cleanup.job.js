const cron = require("node-cron");

const Session = require("../models/session.model");
const VerificationToken = require("../models/verificationToken.model");

const startCleanupJob = () => {

  console.log("Cleanup job scheduled");

  cron.schedule("0 * * * *", async () => {

    try {

      const now = new Date();

      await Session.deleteMany({
        expiresAt: { $lt: now }
      });

      await VerificationToken.deleteMany({
        expiresAt: { $lt: now }
      });

      console.log("Cleanup job executed");

    } catch (err) {

      console.error("Cleanup job error:", err);

    }

  });

};

module.exports = startCleanupJob;