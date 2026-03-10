const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");

const { connectRedis } = require("./src/config/redis");
const initSocket = require("./src/config/socket");
const startCleanupJob = require("./src/jobs/cleanup.job");

const startServer = async () => {

  try {

    await connectDB();

    await connectRedis();

    const server = http.createServer(app);

    initSocket(server);

    startCleanupJob();

    server.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });

  } catch (error) {

    console.error("Server startup error:", error);
    process.exit(1);

  }

};

startServer();