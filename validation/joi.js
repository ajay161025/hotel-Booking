import joi from "joi";

export const hotelOwnerCreateSchema = joi.object({
  email: joi.string().email().lowercase().required().messages({
    "string.email": "Provide valid email",
    "string.lowercase": "Email should be lowercase",
    "string.empty": "Email must!",
    "any.required": "Provide valid Email",
  }),
  name: joi.string().trim().required().messages({
    "string.empty": "Hotel name must!",
    "any.required": "Hotel name must!",
  }),
  description: joi.string().trim().required().messages({
    "string.empty": "Description must!",
    "any.required": "Please enter description about your hotel",
  }),
  address: joi.string().trim().required().messages({
    "string.empty": "Address must!",
    "any.required": "Please enter hotel address",
  }),
  city: joi.string().trim().required().messages({
    "string.empty": "City must!",
    "any.required": "Please enter hotel city",
  }),
  country: joi.string().trim().required().messages({
    "any.required": "Please enter hotel country",
  }),
  starRatings: joi.number().min(1).max(5).required().messages({
    "number.min": "rating 1 to 5",
    "number.max": "rating 1 to 5",
    "any.required": "Please provide starrating",
  }),
  price: joi.number().required().messages({
    "any.required": "Please enter hotel price",
  }),
  numberOfRoom: joi.number().min(10).max(50).required().messages({
    "number.min": "least 10 rooms to start new hotel",
    "number.max": "maxinum room 50",
    "any.required": "Enter how any rooms do you had in your hotel",
  }),

  roomType: joi
    .array()
    .items(
      joi.string().valid("double-bed", "single-bed", "king-size").messages({
        "string.base": "Enter bed type in text",
        "string.empty": "Bed type must!",
        "any.only":
          "Room type must be one of: double-bed, single-bed, king-size",
        "any.required": "Provide bed type",
      })
    )
    .required()
    .messages({
      "array.base": "Room type must be an array",
      "array.empty": "Fill roomType!",
      "any.required": "Room type is required",
    }),

  availableInRoom: joi.object({
    Breakfastincluded: joi.boolean().required().messages({
      "any.required": "Enter breakfast include",
    }),
    Internet: joi.boolean().required().messages({
      "any.required": "Enter internet aceess",
    }),
    Bar: joi.boolean().required().messages({
      "any.required": "Enter bar",
    }),
    Park: joi.boolean().required().messages({
      "any.required": "Enter park",
    }),
    PetFriendly: joi.boolean().required().messages({
      "any.required": "Enter petFriendly",
    }),
  }),
});

export const userCreateSchema = joi.object({
  username: joi.string().min(3).max(25).trim().required().messages({
    "string.min": "Mininum 3 letter",
    "string.max": "Maxinum 25 letter",
    "any.required": "Username must",
  }),
  email: joi.string().trim().lowercase().email().required().messages({
    "string.email": "Enter valid email",
    "string.lowercase": "Email should be lowercase",
    "this.required": "Email must!",
  }),
  password: joi
    .string()
    .trim()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
     "Minium eight characters, at least one letter and one number",
      "any.required": "Password must!",
    }),
});
