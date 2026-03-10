const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  updateUserSchema
} = require("../validators/user.validator");


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile APIs
 */


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get(
  "/me",
  authMiddleware,
  userController.getProfile
);


/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dhanush
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  userController.updateProfile
);


/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 */
router.delete(
  "/me",
  authMiddleware,
  userController.deleteAccount
);


module.exports = router;