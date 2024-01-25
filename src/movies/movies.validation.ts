import * as Joi from 'joi';

export const addMovieRequestValidation = Joi.object({
  title: Joi.string().required(),
  genre: Joi.string().required(),
  rating: Joi.number().min(0).max(10).required(),
  streamingLink: Joi.string().required(),
  releaseDate: Joi.date().required(),
  director: Joi.string().required(),
  description: Joi.string().required(),
});
