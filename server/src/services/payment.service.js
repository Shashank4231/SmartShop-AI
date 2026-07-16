import crypto from "crypto";

import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";
import ApiError from "../utils/ApiError.js";

export const createRazorpayOrderService = async ({
  userId,
  orderId,
}) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.paymentMethod !== "RAZORPAY") {
    throw new ApiError(400, "This order does not use Razorpay");
  }

  if (order.paymentStatus === "Paid") {
    throw new ApiError(400, "Order is already paid");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100),
    currency: "INR",
    receipt: `order_${order._id}`,
    notes: {
      mongoOrderId: order._id.toString(),
      userId: userId.toString(),
    },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    mongoOrderId: order._id,
  };
};

export const verifyRazorpayPaymentService = async ({
  userId,
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!order.razorpayOrderId) {
    throw new ApiError(400, "Razorpay order has not been created");
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, "Razorpay order ID does not match");
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const isValid = generatedSignature === razorpaySignature;

  if (!isValid) {
    order.paymentStatus = "Failed";
    await order.save();

    throw new ApiError(400, "Payment verification failed");
  }

  order.paymentStatus = "Paid";
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;

  if (order.orderStatus === "Pending") {
    order.orderStatus = "Confirmed";
  }

  await order.save();

  return order;
};