import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  cancelOrderService,
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
} from "../services/order.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  const order = await createOrderService({
    userId: req.user._id,
    addressId,
    paymentMethod,
  });

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getMyOrdersService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdService(req.user._id, req.params.orderId);

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await cancelOrderService(req.user._id, req.params.orderId);

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});