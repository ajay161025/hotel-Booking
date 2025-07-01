import joi from "joi";

//admin update
export const adminUpdateSchema = joi.object({
  name: joi.string().trim().messages({
    "string.base": "Hotel name should be in a string",
  }),
  description: joi.string().trim().max(500).messages({
    "string.base": "Description should be in a string",
  }),
  address: joi.string().trim().messages({
    "string.base": "Address should be in a string",
  }),
  city: joi.string().trim().messages({
    "string.base": "City should be in a string",
  }),
  country: joi.string().trim().messages({
    "string.base": "Country should be in a string",
  }),
  starRatings: joi.number().messages({
    "number.base": "starRating should be in a number ",
  }),
  price: joi.number().messages({
    "number.base": "Price should be in a number",
  }),
  availableInRoom: joi.object({
    Breakfastincluded: joi.boolean().messages({
      "boolean.base": "yes or no",
    }),
    Internet: joi.boolean().messages({
      "boolean.base": "yes or no",
    }),
    Bar: joi.boolean().messages({
      "boolean.base": "yes or no",
    }),
    Park: joi.boolean().messages({
      "boolean.base": "yes or no",
    }),
    PetFriendly: joi.boolean().messages({
      "boolean.base": "yes or no",
    }),
  }),
  // roomType
});
