const Joi = require('joi');

module.exports = hotelSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(), 
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.string().allow("",null)
});

