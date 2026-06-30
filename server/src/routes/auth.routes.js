import express from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

import validate from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);

export default router;