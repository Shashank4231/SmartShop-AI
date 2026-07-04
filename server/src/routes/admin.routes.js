import express from "express";

import { getDashboardStats } from "../controllers/admin.controller.js";
import {
  authorizeRoles,
  verifyJWT,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);

export default router;