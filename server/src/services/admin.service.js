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