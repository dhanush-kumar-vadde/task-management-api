const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),

  password: Joi.string()
    .min(6)
});

module.exports = {
  updateUserSchema
};