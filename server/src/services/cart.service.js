import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  cart.items.forEach((item) => {
    const product = item.product;
    const price = product.discountPrice || product.price;

    subtotal += price * item.quantity;
    totalItems += item.quantity;
  });

  const shipping = subtotal > 0 ? 0 : 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return {
    subtotal,
    shipping,
    discount,
    total,
    totalItems,
  };
};

const formatCart = (cart) => {
  const totals = calculateCartTotals(cart);

  return {
    _id: cart._id,
    user: cart.user,
    items: cart.items,
    ...totals,
  };
};

export const getCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title slug price discountPrice stock images brand"
  );

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });

    cart = await cart.populate(
      "items.product",
      "title slug price discountPrice stock images brand"
    );
  }

  return formatCart(cart);
};

export const addToCartService = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + Number(quantity);

    if (product.stock < newQuantity) {
      throw new ApiError(400, "Not enough stock available");
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
    });
  }

  await cart.save();

  const populatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title slug price discountPrice stock images brand"
  );

  return formatCart(populatedCart);
};

export const updateCartItemService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new ApiError(404, "Product not found in cart");
  }

  item.quantity = Number(quantity);
  await cart.save();

  const populatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title slug price discountPrice stock images brand"
  );

  return formatCart(populatedCart);
};

export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  const populatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title slug price discountPrice stock images brand"
  );

  return formatCart(populatedCart);
};

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [];
  await cart.save();

  const populatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title slug price discountPrice stock images brand"
  );

  return formatCart(populatedCart);
};