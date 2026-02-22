const { body } = require("express-validator");

exports.create = [
  body("reader").notEmpty().withMessage("Reader is required"),
  body("type")
    .isIn(["manual", "overdue"])
    .withMessage("Type must be manual or overdue"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("reason").notEmpty().withMessage("Reason is required"),
];

exports.update = [
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("reason").optional().notEmpty().withMessage("Reason is required"),
  body("status")
    .optional()
    .isIn(["unpaid", "paid"])
    .withMessage("Status must be unpaid or paid"),
];
