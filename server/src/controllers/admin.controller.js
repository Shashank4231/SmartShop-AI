import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getDashboardStatsService,
  getAllOrdersService,
  getAdminOrderByIdService,
  updateOrderStatusService,
  getAllUsersService,
  getAdminUserByIdService,
  toggleUserBlockService,
  updateUserRoleService,
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

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService({
    search: req.query.search,
    role: req.query.role,
    status: req.query.status,
  });

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getAdminUserById = asyncHandler(async (req, res) => {
  const data = await getAdminUserByIdService(req.params.userId);

  res
    .status(200)
    .json(new ApiResponse(200, data, "User fetched successfully"));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await updateUserRoleService({
    adminId: req.user._id,
    userId: req.params.userId,
    role: req.body.role,
  });

  res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

export const toggleUserBlock = asyncHandler(async (req, res) => {
  const user = await toggleUserBlockService({
    adminId: req.user._id,
    userId: req.params.userId,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        user.isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully"
      )
    );
});