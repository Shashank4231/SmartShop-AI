import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  createRazorpayOrderService,
  verifyRazorpayPaymentService,
} from "../services/payment.service.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const paymentOrder = await createRazorpayOrderService({
    userId: req.user._id,
    orderId: req.body.orderId,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        paymentOrder,
        "Razorpay order created successfully"
      )
    );
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const order = await verifyRazorpayPaymentService({
    userId: req.user._id,
    orderId: req.body.orderId,
    razorpayOrderId: req.body.razorpayOrderId,
    razorpayPaymentId: req.body.razorpayPaymentId,
    razorpaySignature: req.body.razorpaySignature,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        "Payment verified successfully"
      )
    );
});