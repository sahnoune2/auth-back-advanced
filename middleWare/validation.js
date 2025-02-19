const { body, validationResult } = require("express-validator");

const signUpValidation = [
  body("email", "this email is not validated").isEmail(),
  body("password", "this password is not strong ").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  }),
];

const signInValidation = [
  body("email", "this email is not validated ").isEmail(),
];
const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(400).send({ msg: "there is sth wrong", errors });
  }
};
module.exports = { signInValidation, signUpValidation, validation };
