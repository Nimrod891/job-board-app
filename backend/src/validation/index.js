const Joi = require('joi');

const validationOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
};

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .max(254);

const optionalNameSchema = Joi.string()
  .trim()
  .min(2)
  .max(120)
  .pattern(/^[^<>]*$/, { name: 'no angle brackets' })
  .allow(null)
  .empty('')
  .default(null);

const jobIdParamSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv5'] })
    .message('Job id must be a valid UUID')
    .required(),
});

const createJobSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .pattern(/^[^<>]*$/, { name: 'no angle brackets' })
    .required()
    .messages({
      'string.empty': 'Job title is required',
      'any.required': 'Job title is required',
    }),
  company: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .pattern(/^[^<>]*$/, { name: 'no angle brackets' })
    .required()
    .messages({
      'string.empty': 'Company name is required',
      'any.required': 'Company name is required',
    }),
  location: Joi.string()
    .trim()
    .max(120)
    .pattern(/^[^<>]*$/, { name: 'no angle brackets' })
    .allow(null)
    .empty('')
    .default(null),
  description: Joi.string()
    .trim()
    .max(4000)
    .pattern(/^[^<>]*$/, { name: 'no angle brackets' })
    .allow(null)
    .empty('')
    .default(null),
});

const registrationSchema = Joi.object({
  email: emailSchema.required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const signupSchema = Joi.object({
  email: emailSchema.required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  name: optionalNameSchema,
});

const loginSchema = Joi.object({
  email: emailSchema.required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const userCreationSchema = Joi.object({
  email: emailSchema.required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  name: optionalNameSchema,
});

function validate(schema, payload) {
  const { error, value } = schema.validate(payload, validationOptions);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return { error: message };
  }

  return { value };
}

module.exports = {
  validate,
  schemas: {
    createJob: createJobSchema,
    registration: registrationSchema,
    jobIdParam: jobIdParamSchema,
    signup: signupSchema,
    login: loginSchema,
    userCreation: userCreationSchema,
  },
};

