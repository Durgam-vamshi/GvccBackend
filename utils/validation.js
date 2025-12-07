const { body, validationResult } = require('express-validator');

const enquiryValidationRules = () => [
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("message").notEmpty().withMessage("Message required"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  next();
};

module.exports = { enquiryValidationRules, handleValidation };
