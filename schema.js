  const Joi = require("joi");


 module.exports.movieSchema = Joi.object({
    movie:Joi.object({
      title:Joi.string().required(),
      genre:Joi.string().required(),
      year:Joi.number().required().min(0),
      // image:Joi.string().required()
    }).required()
  })