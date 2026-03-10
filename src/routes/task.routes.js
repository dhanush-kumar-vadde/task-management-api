const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");

const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  updateStatusSchema
} = require("../validators/task.validator");


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - title
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 65fa12ab34cd56ef78ab90cd
 *               title:
 *                 type: string
 *                 example: Implement login API
 *               description:
 *                 type: string
 *                 example: Create JWT login endpoint
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  "/",
  authMiddleware,
  validate(createTaskSchema),
  taskController.createTask
);


/**
 * @swagger
 * /tasks/project/{projectId}:
 *   get:
 *     summary: Get all tasks for a project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  taskController.getTasks
);


/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task details
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fix login API
 *               description:
 *                 type: string
 *                 example: Update JWT validation
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTaskSchema),
  taskController.updateTask
);


/**
 * @swagger
 * /tasks/{id}/assign:
 *   patch:
 *     summary: Assign task to a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 65fa12ab34cd56ef78ab90cd
 *     responses:
 *       200:
 *         description: Task assigned
 */
router.patch(
  "/:id/assign",
  authMiddleware,
  validate(assignTaskSchema),
  taskController.assignTask
);


/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Task status updated
 */
router.patch(
  "/:id/status",
  authMiddleware,
  validate(updateStatusSchema),
  taskController.updateStatus
);


/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  taskController.deleteTask
);


module.exports = router;