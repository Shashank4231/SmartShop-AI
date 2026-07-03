import express from "express";

import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);

export default router;