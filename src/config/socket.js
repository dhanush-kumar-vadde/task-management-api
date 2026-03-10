const { Server } = require("socket.io");
const { verifyAccessToken } = require("../utils/jwt");
const chatSocket = require("../sockets/chat.socket");

const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {

    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {

      const payload = verifyAccessToken(token);

      socket.userId = payload.userId;

      next();

    } catch (error) {
      next(new Error("Invalid token"));
    }

  });

  // attach chat events
  chatSocket(io);

  console.log("Socket server initialized");

  return io;
};

module.exports = initSocket;