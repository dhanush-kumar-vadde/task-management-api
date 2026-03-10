const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization header missing");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(401, "Invalid authorization format");
    }

    const token = parts[1];

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId);

    if (!user || user.deleted) {
      throw new ApiError(401, "Invalid user");
    }

    if (!user.verified) {
      throw new ApiError(403, "Email not verified");
    }

    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;