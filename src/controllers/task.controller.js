const taskService = require("../services/task.service");


/* Create Task */

const createTask = async (req, res, next) => {
  try {

    const task = await taskService.createTask(
      req.body,
      req.user
    );

    res.status(201).json(task);

  } catch (error) {
    next(error);
  }
};


/* Get Tasks */

const getTasks = async (req, res, next) => {
  try {

    const tasks = await taskService.getTasks(
      req.params.projectId,
      req.user._id,
      req.query
    );

    res.json(tasks);

  } catch (error) {
    next(error);
  }
};


/* Update Task */

const updateTask = async (req, res, next) => {
  try {

    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user
    );

    res.json(task);

  } catch (error) {
    next(error);
  }
};


/* Assign Task */

const assignTask = async (req, res, next) => {
  try {

    const task = await taskService.assignTask(
      req.params.id,
      req.body.userId,
      req.user
    );

    res.json(task);

  } catch (error) {
    next(error);
  }
};


/* Update Task Status */

const updateStatus = async (req, res, next) => {
  try {

    const task = await taskService.updateStatus(
      req.params.id,
      req.body.status,
      req.user
    );

    res.json(task);

  } catch (error) {
    next(error);
  }
};


/* Delete Task */

const deleteTask = async (req, res, next) => {
  try {

    const result = await taskService.deleteTask(
      req.params.id,
      req.user
    );

    res.json(result);

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  assignTask,
  updateStatus,
  deleteTask
};