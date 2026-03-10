const ApiError = require("../utils/ApiError");

const requirePlatformRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.platformRole)) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };
};

module.exports = requirePlatformRole;