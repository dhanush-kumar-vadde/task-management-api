const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {

    const { value, error } = schema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    });

    if (error) {
      return next(
        new ApiError(400, error.details[0].message)
      );
    }

    req.body = value;

    next();
  };
};

module.exports = validate;