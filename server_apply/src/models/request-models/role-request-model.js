const Joi = require("joi");

const schema = Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  alias: Joi.string().required(),
});

const validate = (data) => {
  const result = schema.validate(data);
  result.value = data;
  return result;
};

module.exports = validate;
