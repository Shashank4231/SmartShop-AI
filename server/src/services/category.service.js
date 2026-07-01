import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const createCategoryService = async ({ name, description }) => {
  const slug = createSlug(name);

  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  return await Category.create({
    name,
    slug,
    description,
  });
};

export const getAllCategoriesService = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const getCategoryBySlugService = async (slug) => {
  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

export const updateCategoryService = async (categoryId, data) => {
  const updateData = { ...data };

  if (data.name) {
    updateData.slug = createSlug(data.name);
  }

  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

export const deleteCategoryService = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};