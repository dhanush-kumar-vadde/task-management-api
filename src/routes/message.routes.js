const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const messageController = require("../controllers/message.controller");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Project chat messages
 */

/**
 * @swagger
 * /messages/{projectId}:
 *   get:
 *     summary: Get chat messages for a project
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get(
  "/:projectId",
  authMiddleware,
  messageController.getProjectMessages
);

module.exports = router;