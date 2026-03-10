const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requirePlatformRole = require("../middlewares/platformRole.middleware");

const User = require("../models/user.model");
const Project = require("../models/project.model");
const AdminAuditLog = require("../models/adminAuditLog.model");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Platform administration APIs
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all platform users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/users",
  authMiddleware,
  requirePlatformRole("SUPER_ADMIN", "PLATFORM_ADMIN"),
  async (req, res, next) => {
    try {

      const users = await User.find({ deleted: false });

      res.json(users);

    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /admin/projects/{id}:
 *   delete:
 *     summary: Admin delete a project
 *     tags: [Admin]
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
  "/projects/:id",
  authMiddleware,
  requirePlatformRole("SUPER_ADMIN", "PLATFORM_ADMIN"),
  async (req, res, next) => {
    try {

      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.deleted = true;
      project.deletedAt = new Date();

      await project.save();

      await AdminAuditLog.create({
        adminId: req.user._id,
        action: "DELETE_PROJECT",
        targetType: "PROJECT",
        targetId: project._id
      });

      res.json({ message: "Project deleted by admin" });

    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;