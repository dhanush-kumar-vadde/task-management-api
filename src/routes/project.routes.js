const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");

const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  removeMemberSchema
} = require("../validators/project.validator");


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */


/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Internship Project
 *               description:
 *                 type: string
 *                 example: Task management backend
 *     responses:
 *       201:
 *         description: Project created
 */
router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  projectController.createProject
);


/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for logged-in user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get(
  "/",
  authMiddleware,
  projectController.getProjects
);


/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a single project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 */
router.get(
  "/:id",
  authMiddleware,
  projectController.getProjectById
);


/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Project updated
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateProjectSchema),
  projectController.updateProject
);


/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  projectController.deleteProject
);


/**
 * @swagger
 * /projects/{id}/members:
 *   post:
 *     summary: Add member to project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 example: 65f93a3a
 *               role:
 *                 type: string
 *                 enum: [MANAGER, MEMBER]
 *                 example: MEMBER
 *     responses:
 *       200:
 *         description: Member added
 */
router.post(
  "/:id/members",
  authMiddleware,
  validate(addMemberSchema),
  projectController.addMember
);


/**
 * @swagger
 * /projects/{id}/members:
 *   delete:
 *     summary: Remove member from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 example: 65f93a3a
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete(
  "/:id/members",
  authMiddleware,
  validate(removeMemberSchema),
  projectController.removeMember
);


module.exports = router;