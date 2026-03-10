const Project = require("../models/project.model");
const User = require("../models/user.model");
const ActivityLog = require("../models/activityLog.model");
const buildQuery = require("../utils/queryFeatures");
const ApiError = require("../utils/ApiError");


/* Create Project */

const createProject = async (data, user) => {

  const project = await Project.create({
    name: data.name,
    description: data.description || "",
    owner: user._id,

    members: [
      {
        userId: user._id,
        username: user.name,
        role: "OWNER"
      }
    ]
  });

  await ActivityLog.create({
    projectId: project._id,
    action: "PROJECT_CREATED",
    performedBy: {
      userId: user._id,
      username: user.name
    },
    metadata: {
      projectName: project.name
    }
  });

  return project;
};


/* Get All Projects for User */

const getProjects = async (userId, reqQuery) => {

  const { page, limit, skip, sort, filters } = buildQuery(reqQuery);

  const query = {
    "members.userId": userId,
    deleted: false,
    ...filters
  };

  const projects = await Project.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Project.countDocuments(query);

  return {
    page,
    limit,
    total,
    data: projects
  };
};


/* Get Single Project */

const getProjectById = async (projectId, userId) => {

  const project = await Project.findOne({
    _id: projectId,
    deleted: false,
    "members.userId": userId
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};


/* Update Project */

const updateProject = async (projectId, data, user) => {

  const project = await Project.findById(projectId);

  if (!project || project.deleted) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "Only project owner can update project");
  }

  if (data.name !== undefined) {
    project.name = data.name;
  }

  if (data.description !== undefined) {
    project.description = data.description;
  }

  await project.save();

  await ActivityLog.create({
    projectId: project._id,
    action: "PROJECT_UPDATED",
    performedBy: {
      userId: user._id,
      username: user.name
    }
  });

  return project;
};


/* Delete Project (Soft Delete) */

const deleteProject = async (projectId, user) => {

  const project = await Project.findById(projectId);

  if (!project || project.deleted) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "Only project owner can delete project");
  }

  project.deleted = true;
  project.deletedAt = new Date();

  await project.save();

/* cascade delete tasks */

  await Task.updateMany(
  { projectId: project._id },
    {
      deleted: true,
      deletedAt: new Date()
    }
  );

  await ActivityLog.create({
    projectId: project._id,
    action: "PROJECT_DELETED",
    performedBy: {
      userId: user._id,
      username: user.name
    }
  });

  return { message: "Project deleted" };
};


/* Add Member */

const addMember = async (projectId, userId, role, user) => {

  const project = await Project.findById(projectId);

  if (!project || project.deleted) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "Only owner can add members");
  }

  const existingMember = project.members.find(
    (m) => m.userId.toString() === userId
  );

  if (existingMember) {
    throw new ApiError(400, "User already a member");
  }

  const newUser = await User.findById(userId);

  if (!newUser) {
    throw new ApiError(404, "User not found");
  }

  project.members.push({
    userId: newUser._id,
    username: newUser.name,
    role
  });

  await project.save();

  await ActivityLog.create({
    projectId,
    action: "MEMBER_ADDED",
    performedBy: {
      userId: user._id,
      username: user.name
    },
    metadata: {
      addedUser: newUser.name
    }
  });

  return project;
};


/* Remove Member */

const removeMember = async (projectId, userId, user) => {

  const project = await Project.findById(projectId);

  if (!project || project.deleted) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "Only owner can remove members");
  }

  project.members = project.members.filter(
    (m) => m.userId.toString() !== userId
  );

  await project.save();

  await ActivityLog.create({
    projectId,
    action: "MEMBER_REMOVED",
    performedBy: {
      userId: user._id,
      username: user.name
    }
  });

  return project;
};


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};