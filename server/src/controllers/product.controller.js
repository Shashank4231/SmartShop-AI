import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductBySlugService,
  updateProductService,
} from "../services/product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(req.body, req.files, req.user._id);

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const result = await getAllProductsService(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Products fetched successfully"));
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await getProductBySlugService(req.params.slug);

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.params.id, req.body, req.files);

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});