import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const calculateCartTotals = (items) => {
  let subtotal = 0;

  items.forEach((item) => {
    const product = item.product;
    const price = product.discountPrice || product.price;

    subtotal += price * item.quantity;
  });

  const shipping = subtotal > 0 ? 0 : 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return {
    subtotal,
    shipping,
    discount,
    total,
  };
};

export const createOrderService = async ({
  userId,
  addressId,
  paymentMethod,
}) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const shippingAddress = user.addresses.id(addressId);

  if (!shippingAddress) {
    throw new ApiError(404, "Shipping address not found");
  }

  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title price discountPrice stock images isActive"
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw new ApiError(400, "One or more products are unavailable");
    }

    if (item.product.stock < item.quantity) {
      throw new ApiError(
        400,
        `${item.product.title} does not have enough stock`
      );
    }
  }

  const totals = calculateCartTotals(cart.items);

  const orderItems = cart.items.map((item) => {
    const product = item.product;
    const price = product.discountPrice || product.price;

    return {
      product: product._id,
      title: product.title,
      image: product.images?.[0]?.url || "",
      price,
      quantity: item.quantity,
    };
  });

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress: {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    },
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
    orderStatus: "Pending",
    ...totals,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  cart.items = [];
  await cart.save();

  return order;
};

export const getMyOrdersService = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderByIdService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

export const cancelOrderService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!["Pending", "Confirmed"].includes(order.orderStatus)) {
    throw new ApiError(400, "Order cannot be cancelled at this stage");
  }

  order.orderStatus = "Cancelled";
  order.cancelledAt = new Date();

  await order.save();

  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
      },
    });
  }

  return order;
};