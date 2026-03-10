const userService = require("../services/user.service");


const getProfile = async (req, res, next) => {
  try {

    const user = await userService.getProfile(
      req.user._id
    );

    res.json(user);

  } catch (error) {
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {

    const result = await userService.updateProfile(
      req.user._id,
      req.body
    );

    res.json(result);

  } catch (error) {
    next(error);
  }
};


const deleteAccount = async (req, res, next) => {
  try {

    const result = await userService.deleteAccount(
      req.user._id
    );

    res.json(result);

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProfile,
  updateProfile,
  deleteAccount
};