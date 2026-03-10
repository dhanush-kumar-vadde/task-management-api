const Joi = require("joi");

/**
 * Register validation
 */
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required()
});

/**
 * Login validation
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()
});

/**
 * Resend verification validation
 */
const resendVerificationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
});

module.exports = {
  registerSchema,
  loginSchema,
  resendVerificationSchema
};