import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getDashboardStatsService,
  getAllOrdersService,
  getAdminOrderByIdService,
  updateOrderStatusService,
} from "../services/admin.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStatsService();

  res
    .status(200)
    .json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrdersService({
    status: req.query.status,
    search: req.query.search,
  });

  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getAdminOrderById = asyncHandler(async (req, res) => {
  const order = await getAdminOrderByIdService(req.params.orderId);

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatusService(
    req.params.orderId,
    req.body.status
  );

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});