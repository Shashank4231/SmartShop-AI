import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await addToWishlistService(
    req.user._id,
    req.params.productId
  );

  res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Product added to wishlist"));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await removeFromWishlistService(
    req.user._id,
    req.params.productId
  );

  res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Product removed from wishlist"));
});