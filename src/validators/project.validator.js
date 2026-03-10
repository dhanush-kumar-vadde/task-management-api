const Joi = require("joi");

/* Create Project */

const createProjectSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .max(500)
    .allow("")
});


/* Update Project */

const updateProjectSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),

  description: Joi.string()
    .max(500)
    .allow("")
});


/* Add Member */

const addMemberSchema = Joi.object({
  userId: Joi.string()
    .required(),

  role: Joi.string()
    .valid("MANAGER", "MEMBER")
    .default("MEMBER")
});


/* Remove Member */

const removeMemberSchema = Joi.object({
  userId: Joi.string()
    .required()
});


module.exports = {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  removeMemberSchema
};