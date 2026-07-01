import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addToCartService,
  clearCartService,
  getCartService,
  removeCartItemService,
  updateCartItemService,
} from "../services/cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await addToCartService(req.user._id, productId, quantity);

  res.status(200).json(new ApiResponse(200, cart, "Product added to cart"));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await updateCartItemService(
    req.user._id,
    req.params.productId,
    Number(quantity)
  );

  res.status(200).json(new ApiResponse(200, cart, "Cart item updated"));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItemService(req.user._id, req.params.productId);

  res.status(200).json(new ApiResponse(200, cart, "Cart item removed"));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService(req.user._id);

  res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
});