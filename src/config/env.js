const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/task-manager",
  nodeEnv: process.env.NODE_ENV || "development"
};

module.exports = env;