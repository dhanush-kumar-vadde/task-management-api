const projectService = require("../services/project.service");


/* Create Project */

const createProject = async (req, res, next) => {
  try {

    const project = await projectService.createProject(
      req.body,
      req.user
    );

    res.status(201).json(project);

  } catch (error) {
    next(error);
  }
};


/* Get All Projects */

const getProjects = async (req, res, next) => {
  try {

    const projects = await projectService.getProjects(
      req.user._id,
      req.query
    );

    res.json(projects);

  } catch (error) {
    next(error);
  }
};


/* Get Single Project */

const getProjectById = async (req, res, next) => {
  try {

    const project = await projectService.getProjectById(
      req.params.id,
      req.user._id
    );

    res.json(project);

  } catch (error) {
    next(error);
  }
};


/* Update Project */

const updateProject = async (req, res, next) => {
  try {

    const project = await projectService.updateProject(
      req.params.id,
      req.body,
      req.user
    );

    res.json(project);

  } catch (error) {
    next(error);
  }
};


/* Delete Project */

const deleteProject = async (req, res, next) => {
  try {

    const result = await projectService.deleteProject(
      req.params.id,
      req.user
    );

    res.json(result);

  } catch (error) {
    next(error);
  }
};


/* Add Member */

const addMember = async (req, res, next) => {
  try {

    const project = await projectService.addMember(
      req.params.id,
      req.body.userId,
      req.body.role,
      req.user
    );

    res.json(project);

  } catch (error) {
    next(error);
  }
};


/* Remove Member */

const removeMember = async (req, res, next) => {
  try {

    const project = await projectService.removeMember(
      req.params.id,
      req.body.userId,
      req.user
    );

    res.json(project);

  } catch (error) {
    next(error);
  }
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