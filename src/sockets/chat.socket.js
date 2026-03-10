const Message = require("../models/message.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");

const chatSocket = (io) => {

  io.on("connection", (socket) => {

    socket.on("joinProject", async (projectId) => {

      try {

        const project = await Project.findById(projectId);

        if (!project) {
          return socket.emit("error", "Project not found");
        }

        const member = project.members.find(
          m => m.userId.toString() === socket.userId
        );

        if (!member) {
          return socket.emit("error", "Not a project member");
        }

        socket.join(projectId);

      } catch (err) {
        socket.emit("error", "Join project failed");
      }

    });

    socket.on("sendMessage", async ({ projectId, content }) => {

      try {

        const user = await User.findById(socket.userId);

        const message = await Message.create({
          projectId,
          sender: {
            userId: user._id,
            username: user.name
          },
          content
        });

        io.to(projectId).emit("newMessage", message);

      } catch (err) {
        socket.emit("error", "Message send failed");
      }

    });

  });

};

module.exports = chatSocket;