import express from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/category.controller.js";

import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validator.js";

import validate from "../middleware/validate.middleware.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  createCategoryValidator,
  validate,
  createCategory
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("admin"),
  updateCategoryValidator,
  validate,
  updateCategory
);

router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteCategory);

export default router;