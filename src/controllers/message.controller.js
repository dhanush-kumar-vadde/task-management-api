const Message = require("../models/message.model");
const Project = require("../models/project.model");
const ApiError = require("../utils/ApiError");

const getProjectMessages = async (req, res, next) => {
  try {

    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project || project.deleted) {
      throw new ApiError(404, "Project not found");
    }

    const member = project.members.find(
      (m) => m.userId.toString() === req.user._id.toString()
    );

    if (!member) {
      throw new ApiError(403, "Not a project member");
    }

    const messages = await Message.find({ projectId })
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectMessages
};