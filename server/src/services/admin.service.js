import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";

export const getDashboardStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalOrders = await Order.countDocuments();

  const revenueResult = await Order.aggregate([
    {
      $match: {
        orderStatus: {
          $ne: "Cancelled",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$total",
        },
      },
    },
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
  };
};

export const getAllOrdersService = async ({ status, search }) => {
  const query = {};

  if (status) {
    query.orderStatus = status;
  }

  let orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  if (search) {
    orders = orders.filter((order) => {
      const orderId = order._id.toString().toLowerCase();
      const userName = order.user?.name?.toLowerCase() || "";
      const userEmail = order.user?.email?.toLowerCase() || "";
      const keyword = search.toLowerCase();

      return (
        orderId.includes(keyword) ||
        userName.includes(keyword) ||
        userEmail.includes(keyword)
      );
    });
  }

  return orders;
};

export const getAdminOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

export const updateOrderStatusService = async (orderId, status) => {
  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.deliveredAt = new Date();
  }

  if (status === "Cancelled") {
    order.cancelledAt = new Date();
  }

  await order.save();

  return await Order.findById(orderId).populate("user", "name email");
};

export const getAllUsersService = async ({ search, role, status }) => {
  const query = {};

  if (role) {
    query.role = role;
  }

  if (status === "blocked") {
    query.isBlocked = true;
  }

  if (status === "active") {
    query.isBlocked = false;
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return await User.find(query)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
};

export const getAdminUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .populate("wishlist", "title slug price discountPrice images");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);

  const totalSpendingResult = await Order.aggregate([
    {
      $match: {
        user: user._id,
        orderStatus: {
          $ne: "Cancelled",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSpending: {
          $sum: "$total",
        },
      },
    },
  ]);

  return {
    user,
    recentOrders: orders,
    totalSpending: totalSpendingResult[0]?.totalSpending || 0,
  };
};

export const updateUserRoleService = async ({
  adminId,
  userId,
  role,
}) => {
  const allowedRoles = ["user", "admin", "seller"];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid user role");
  }

  if (adminId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = role;
  await user.save();

  return await User.findById(userId).select("-password -refreshToken");
};

export const toggleUserBlockService = async ({
  adminId,
  userId,
}) => {
  if (adminId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot block your own account");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  return await User.findById(userId).select("-password -refreshToken");
};