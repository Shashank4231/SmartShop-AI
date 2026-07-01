import { body } from "express-validator";

export const createCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty"),
];