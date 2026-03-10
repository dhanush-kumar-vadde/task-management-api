const ApiError = require("../utils/ApiError");
const Project = require("../models/project.model");

const requireProjectRole = (...roles) => {
  return async (req, res, next) => {

    try {

      const projectId =
        req.params.projectId ||
        req.params.id ||
        req.body.projectId;

      if (!projectId) {
        return next(new ApiError(400, "Project ID required"));
      }

      const project = await Project.findById(projectId);

      if (!project || project.deleted) {
        return next(new ApiError(404, "Project not found"));
      }

      const member = project.members.find(
        (m) => m.userId.toString() === req.user._id.toString()
      );

      if (!member || !roles.includes(member.role)) {
        return next(new ApiError(403, "Forbidden"));
      }

      req.projectRole = member.role;
      req.project = project;

      next();

    } catch (err) {
      next(err);
    }

  };
};

module.exports = requireProjectRole;