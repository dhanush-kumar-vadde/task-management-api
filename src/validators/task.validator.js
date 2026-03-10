const Joi = require("joi");


/* Create Task */

const createTaskSchema = Joi.object({
  projectId: Joi.string()
    .required(),

  title: Joi.string()
    .min(2)
    .max(200)
    .required(),

  description: Joi.string()
    .allow("")
});


/* Update Task */

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(200),

  description: Joi.string()
    .allow("")
});


/* Assign Task */

const assignTaskSchema = Joi.object({
  userId: Joi.string()
    .required()
});


/* Update Status */

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("TODO", "IN_PROGRESS", "DONE")
    .required()
});


module.exports = {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  updateStatusSchema
};