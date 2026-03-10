const User = require("../models/user.model");
const Project = require("../models/project.model");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");


/* Get Profile */

const getProfile = async (userId) => {

  const user = await User.findById(userId).select(
    "-passwordHash"
  );

  if (!user || user.deleted) {
    throw new ApiError(404, "User not found");
  }

  return user;
};


/* Update Profile */

const updateProfile = async (userId, data) => {

  const user = await User.findById(userId);

  if (!user || user.deleted) {
    throw new ApiError(404, "User not found");
  }

  if (data.name !== undefined) {
    user.name = data.name;
  }

  if (data.password !== undefined) {
    const hash = await bcrypt.hash(data.password, 10);
    user.passwordHash = hash;
  }

  await user.save();

  return {
    message: "Profile updated"
  };
};


/* Delete Account */

const deleteAccount = async (userId) => {

  const user = await User.findById(userId);

  if (!user || user.deleted) {
    throw new ApiError(404, "User not found");
  }

  /* Check owner constraint */

  const ownedProject = await Project.findOne({
    owner: userId,
    deleted: false
  });

  if (ownedProject) {
    throw new ApiError(
      400,
      "Transfer or delete owned projects before deleting account"
    );
  }

  user.deleted = true;
  user.deletedAt = new Date();

  await user.save();

  return {
    message: "Account deleted"
  };
};


module.exports = {
  getProfile,
  updateProfile,
  deleteAccount
};