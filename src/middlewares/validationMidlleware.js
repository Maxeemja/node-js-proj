const Joi = require('joi');

const registrationValidator = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
        .min(4)
        .max(24)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    role: Joi.string()
        .required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

const loadCreationValidation = async (req, res, next) => {
  const schema = Joi.object({
    payload: Joi.number().required(),
    delivery_address: Joi.string().required(),
    pickup_address: Joi.string().required(),
    name: Joi.string().required()
  })

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registrationValidator,
  loadCreationValidation
};
