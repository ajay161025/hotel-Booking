import joi from "joi";

//user register
export const userCreateSchema = joi.object({
  username: joi.string().min(3).max(25).trim().required().messages({
    "string.base": "Username should be in a string",
    "string.min": "Mininum 3 letter",
    "string.max": "Maxinum 25 letter",
    "any.required": "Username required",
  }),
  email: joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email should be in a string",
    "string.email": "Enter valid email",
    "string.lowercase": "Email should be lowercase",
    "this.required": "Email required!",
  }),
  password: joi
    .string()
    .trim()
    // .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .messages({
      //   "string.pattern.base":
      //     "Minium eight characters, at least one letter and one number",
      "any.required": "Password required!",
    }),
});

//user login
export const userLoginSchema = joi.object({
  email: joi.string().email().lowercase().trim().required().messages({
    "string.base": "Email should be in a string",
    "string.email": "Enter valild email",
    "string.lowercase": "Email should be inca lowercase",
    "this.required": "Email required!",
  }),
  password: joi
    .string()
    .trim()
    // .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .messages({
      //   "string.pattern.base":
      //     "Minium eight characters, at least one letter and one number",
      "any.required": " Enter a Password",
    }),
});

//user booking
export const bookingCreateSchema = joi.object({
  name: joi.string().trim().required().messages({
    "string.base": "Hotel Name should be in a string",
    "string.empty": "Hotel Name required",
    "any.required": " Enter Hotel Name",
  }),
  roomType: joi
    .array()
    .items(
      joi.string().valid("double-bed", "single-bed", "king-size").messages({
        "string.base": "Bed-type should be in a string",
        "string.empty": "Bed-type required!",
        "any.only":
          "Room type must be one of: double-bed, single-bed, king-size",
        "any.required": "Provide bed-type",
      })
    )
    .required()
    .messages({
      "array.base": "Room type must be an array",
      "array.empty": "Room-type required",
      "any.required": "Enter a Room-type",
    }),
  selectRooms: joi.number().max(10).required().messages({
    "number.base": "Selectrooms should be in a number",
    "number.empty": "Number of rooms required",
    "number.max":"Maxinum 10 rooms",
    "any.required": "Enter a selectRooms",
  }),
  numberOfGuests: joi.number().required().messages({
    "number.base": "Numberofguests should be in a number",
    "number.empty": "numberOfGuests required",
    "any.required": "Enter number of guests",
  }),
  stay: joi.array().items(
    joi.object({
      adult: joi.number().max(4).required().messages({
        "number.base": "Adult should be in a number",
        "number.empty": "Adult required",
        "number.max": "Maxinum adult 4 in one room",
        "any.required": "Enter a adult count",
      }),
      children: joi.number().max(4).required().messages({
        "number.base": "Children should be in a number",
        "number.empty": "Children required",
        "number.max": "Maxinum children 4 in one room",
        "any.required": "Enter a children count",
      }),
      rooms: joi.number().max(10).required().messages({
        "number.base": "Rooms should be in a number",
        "number.empty": "rooms required",
        "number.max": "Maxinum room 10",
        "any.required": "Enter a number of rooms",
      }),
    })
  ),
  checkInDate: joi.date().required().required().messages({
    "date.base": "Date must be text",
    "date.empty": "checkInDate required",
    "any.required": "Enter a checkindate",
  }),
  checkOutDate: joi.date().required().required().messages({
    "date.base": "Date must be text",
    "date.empty": "checkOutDate required",
    "any.required": "Enter a checkoutdate",
  }),
});
