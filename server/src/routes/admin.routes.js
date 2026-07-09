import express from "express";

import {
  getDashboardStats,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "../controllers/admin.controller.js";
import {
  authorizeRoles,
  verifyJWT,
} from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getAdminOrderById);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);

export default router;