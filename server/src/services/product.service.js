import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const createSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const createProductService = async (data, files, userId) => {
  const category = await Category.findById(data.category);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const slug = `${createSlug(data.title)}-${Date.now()}`;

  const images = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, "smartshop/products");

      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  return await Product.create({
    ...data,
    slug,
    images,
    seller: userId,
  });
};

export const getAllProductsService = async (query) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 12,
  } = query;

  const filter = {
    isActive: true,
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = { $regex: brand, $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sortOrder = order === "asc" ? 1 : -1;

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .populate("seller", "name email")
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
    },
  };
};

export const getProductBySlugService = async (slug) => {
  const product = await Product.findOne({ slug })
    .populate("category", "name slug")
    .populate("seller", "name email");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const updateProductService = async (productId, data, files) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (data.title) {
    data.slug = `${createSlug(data.title)}-${Date.now()}`;
  }

  if (files && files.length > 0) {
    const newImages = [];

    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, "smartshop/products");

      newImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    data.images = [...product.images, ...newImages];
  }

  return await Product.findByIdAndUpdate(productId, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProductService = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};