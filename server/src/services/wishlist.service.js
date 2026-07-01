import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const getWishlistService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    select: "title slug price discountPrice stock images brand rating numReviews",
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.wishlist;
};

export const addToWishlistService = async (userId, productId) => {
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const alreadyExists = user.wishlist.some(
    (item) => item.toString() === productId
  );

  if (alreadyExists) {
    throw new ApiError(409, "Product already in wishlist");
  }

  user.wishlist.push(productId);
  await user.save();

  return await getWishlistService(userId);
};

export const removeFromWishlistService = async (userId, productId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.wishlist = user.wishlist.filter(
    (item) => item.toString() !== productId
  );

  await user.save();

  return await getWishlistService(userId);
};