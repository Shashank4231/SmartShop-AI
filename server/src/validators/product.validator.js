import { body } from "express-validator";

export const createProductValidator = [
  body("title").trim().notEmpty().withMessage("Product title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").isNumeric().withMessage("Stock must be a number"),
  body("category").notEmpty().withMessage("Category is required"),
];

export const updateProductValidator = [
  body("title").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("price").optional().isNumeric(),
  body("stock").optional().isNumeric(),
];