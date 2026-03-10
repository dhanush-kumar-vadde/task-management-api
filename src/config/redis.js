const { createClient } = require("redis");

let redisClient;

const connectRedis = async () => {
  if (redisClient) return redisClient;

  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
  });

  redisClient.on("connect", () => {
    console.log("Redis connecting...");
  });

  redisClient.on("ready", () => {
    console.log("Redis ready");
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redisClient.connect();

  return redisClient;
};

const getRedis = () => {
  if (!redisClient) {
    throw new Error("Redis not initialized");
  }
  return redisClient;
};

module.exports = {
  connectRedis,
  getRedis
};