import { body } from "express-validator";

export const addressValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("addressLine1").trim().notEmpty().withMessage("Address line 1 is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required"),
];