const Task = require("../models/task.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const ActivityLog = require("../models/activityLog.model");
const buildQuery = require("../utils/queryFeatures");
const ApiError = require("../utils/ApiError");


/* Helper: get member role */

const getMemberRole = (project, userId) => {
  const member = project.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  if (!member) return null;

  return member.role;
};


/* Create Task */

const createTask = async (data, user) => {

  const project = await Project.findById(data.projectId);

  if (!project || project.deleted) {
    throw new ApiError(404, "Project not found");
  }

  const role = getMemberRole(project, user._id);

  if (!role) {
    throw new ApiError(403, "Not a project member");
  }

  if (role === "MEMBER") {
    throw new ApiError(403, "Members cannot create tasks");
  }

  const task = await Task.create({
    projectId: project._id,
    title: data.title,
    description: data.description || "",

    createdBy: {
      userId: user._id,
      username: user.name
    }
  });

  await ActivityLog.create({
    projectId: project._id,
    action: "TASK_CREATED",
    performedBy: {
      userId: user._id,
      username: user.name
    },
    metadata: {
      taskTitle: task.title
    }
  });

  return task;
};


/* Get Tasks for Project */

const getTasks = async (projectId, userId, reqQuery) => {

  const project = await Project.findById(projectId);

  if (!project || project.deleted) {
    throw new ApiError(404, "Project not found");
  }

  const role = getMemberRole(project, userId);

  if (!role) {
    throw new ApiError(403, "Not a project member");
  }

  const { page, limit, skip, sort, filters } = buildQuery(reqQuery);

  const query = {
    projectId,
    deleted: false,
    ...filters
  };

  const tasks = await Task.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  return {
    page,
    limit,
    total,
    data: tasks
  };
};


/* Update Task */

const updateTask = async (taskId, data, user) => {

  const task = await Task.findById(taskId);

  if (!task || task.deleted) {
    throw new ApiError(404, "Task not found");
  }

  const project = await Project.findById(task.projectId);

  const role = getMemberRole(project, user._id);

  if (!role || role === "MEMBER") {
    throw new ApiError(403, "Only owner or manager can update tasks");
  }

  if (data.title !== undefined) {
    task.title = data.title;
  }

  if (data.description !== undefined) {
    task.description = data.description;
  }

  await task.save();

  await ActivityLog.create({
    projectId: project._id,
    action: "TASK_UPDATED",
    performedBy: {
      userId: user._id,
      username: user.name
    }
  });

  return task;
};


/* Assign Task */

const assignTask = async (taskId, userId, user) => {

  const task = await Task.findById(taskId);

  if (!task || task.deleted) {
    throw new ApiError(404, "Task not found");
  }

  const project = await Project.findById(task.projectId);

  const role = getMemberRole(project, user._id);

  if (!role || role === "MEMBER") {
    throw new ApiError(403, "Only owner or manager can assign tasks");
  }

  const assignedUser = await User.findById(userId);

  if (!assignedUser) {
    throw new ApiError(404, "User not found");
  }

  task.assignedTo = {
    userId: assignedUser._id,
    username: assignedUser.name
  };

  await task.save();

  await ActivityLog.create({
    projectId: project._id,
    action: "TASK_ASSIGNED",
    performedBy: {
      userId: user._id,
      username: user.name
    },
    metadata: {
      assignedTo: assignedUser.name
    }
  });

  return task;
};


/* Update Task Status */

const updateStatus = async (taskId, status, user) => {

  const task = await Task.findById(taskId);

  if (!task || task.deleted) {
    throw new ApiError(404, "Task not found");
  }

  if (
    !task.assignedTo ||
    task.assignedTo.userId.toString() !== user._id.toString()
  ) {
    throw new ApiError(
      403,
      "Only the assigned user can update task status"
    );
  }

  task.status = status;

  await task.save();

  await ActivityLog.create({
    projectId: task.projectId,
    action: "TASK_STATUS_UPDATED",
    performedBy: {
      userId: user._id,
      username: user.name
    },
    metadata: {
      status
    }
  });

  return task;
};


/* Delete Task */

const deleteTask = async (taskId, user) => {

  const task = await Task.findById(taskId);

  if (!task || task.deleted) {
    throw new ApiError(404, "Task not found");
  }

  const project = await Project.findById(task.projectId);

  const role = getMemberRole(project, user._id);

  if (!role || role === "MEMBER") {
    throw new ApiError(403, "Only owner or manager can delete tasks");
  }

  task.deleted = true;
  task.deletedAt = new Date();

  await task.save();

  await ActivityLog.create({
    projectId: task.projectId,
    action: "TASK_DELETED",
    performedBy: {
      userId: user._id,
      username: user.name
    }
  });

  return { message: "Task deleted" };
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  assignTask,
  updateStatus,
  deleteTask
};