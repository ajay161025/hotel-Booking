import joi from "joi";

//register
export const hotelRegisterSchema = joi.object({
  user: joi.string().trim().required().messages({
    "string.base": "Username should be in a string ",
    "string.empty": "Username required!",
    "any.required": "Enter a username",
  }),
  email: joi.string().trim().email().lowercase().required().messages({
    "string.base": "Email should be in a string",
    "string.empty": "Email required!",
    "string.email": "Provide valid email",
    "string.lowercase": "Email should be in a lowercase",
    "any.required": "Enter a Email",
  }),
  password: joi
    .string()
    .trim()
    // .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .messages({
      // "string.pattern.base":
      //   "Minium eight characters, at least one letter and one number",
      "any.required": "Password required!",
    }),
});

//login
export const hotelLoginSchema = joi.object({
  email: joi.string().trim().email().lowercase().required().messages({
    "string.base": "Email should be in a string",
    "string.email": "Provide valid email",
    "string.lowercase": "Email should be in lowercase",
    "any.required": "Email required!",
  }),
  password: joi
    .string()
    .trim()
    // .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .messages({
      // "string.pattern.base":
      //   "Minium eight characters, at least one letter and one number",
      "any.required": "Password required!",
    }),
});

//hotel
export const hotelOwnerCreateSchema = joi.object({
  email: joi.string().email().lowercase().required().messages({
    "string.base": "Email should be in a string",
    "string.email": "Provide valid email",
    "string.lowercase": "Email should be lowercase",
    "string.empty": "Email required!",
    "any.required": "Provide valid Email",
  }),
  name: joi.string().trim().required().messages({
    "string.base": "password should be in a string",
    "string.empty": "Hotel name required!",
    "any.required": " Enter Hotel name",
  }),
  description: joi.string().trim().max(500).required().messages({
    "string.base": "Description should be in a string",
    "string.empty": "Description required!",
    "any.required": "Enter description about your hotel",
  }),
  address: joi.string().trim().required().messages({
    "string.base": "Address should be in a string",
    "string.empty": "Address required!",
    "any.required": "Enter hotel address",
  }),
  city: joi.string().trim().required().messages({
    "string.base": "City should be in a string",
    "string.empty": "City required!",
    "any.required": "Enter hotel city",
  }),
  country: joi.string().trim().required().messages({
    "string.base": "Country should be in a string",
    "string.empty": "Country required",
    "any.required": "Enter hotel country",
  }),
  starRatings: joi.number().min(1).max(5).required().messages({
    "number.base": "starRaning should be in a number",
    "number.empty": "starRating required!",
    "number.min": "rating 1 to 5",
    "number.max": "rating 1 to 5",
    "any.required": "Provide starating",
  }),
  price: joi.number().required().messages({
    "number.base": "price should be in a number",
    "number.empty": "price required!",
    "any.required": "Enter hotel price",
  }),
  numberOfRoom: joi.number().min(10).max(50).required().messages({
    "number.base": "NumberOfRooms should be in a number",
    "number.empty": "NumberOfRooms required!",
    "number.min": "Least 10 rooms to start new hotel",
    "number.max": "Maxinum 50 rooms",
    "any.required": "Enter how any rooms do you had in your hotel",
  }),

  roomType: joi
    .array()
    .items(
      joi.string().valid("double-bed", "single-bed", "king-size").messages({
        "string.base": "Enter bed-type in  a text",
        "string.empty": "Bed-type required!",
        "any.only":
          "Room type must be one of: double-bed, single-bed, king-size",
        "any.required": "Enter a Bed-type",
      })
    )
    .required()
    .messages({
      "array.base": "Room type must be an array",
      "array.empty": "RoomType required!",
      "any.required": "Enter a Room-type",
    }),

  availableInRoom: joi.object({
    Breakfastincluded: joi.boolean().required().messages({
      "boolean.base": "yes or no",
      "any.required": "Enter breakfast-include",
    }),
    Internet: joi.boolean().required().messages({
      "boolean.base": "yes or no",
      "any.required": "Enter internet aceess",
    }),
    Bar: joi.boolean().required().messages({
      "boolean.base": "yes or no",
      "any.required": "Enter bar",
    }),
    Park: joi.boolean().required().messages({
      "boolean.base": "yes or no",
      "any.required": "Enter park",
    }),
    PetFriendly: joi.boolean().required().messages({
      "boolean.base": "yes or no",
      "any.required": "Enter pet-Friendly",
    }),
  }),
});

//update
export const hotelUpdateSchema = joi.object({
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
    "string.base": " Country should be in a string",
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
  roomType: joi
    .array()
    .items(
      joi.string().valid("double-bed", "single-bed", "king-size").messages({
        "string.base": "Enter bed-type in  a text",
      })
    )

    .messages({
      "array.base": "Room-type must be an array",
    }),
});
