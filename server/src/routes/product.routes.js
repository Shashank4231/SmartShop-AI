import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
} from "../controllers/product.controller.js";

import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validator.js";

import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  upload.array("images", 5),
  createProductValidator,
  validate,
  createProduct
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("admin"),
  upload.array("images", 5),
  updateProductValidator,
  validate,
  updateProduct
);

router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteProduct);

export default router;