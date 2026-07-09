import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/category.service";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await getCategories();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const createAdminCategory = createAsyncThunk(
  "category/createAdminCategory",
  async (categoryData, thunkAPI) => {
    try {
      const response = await createCategory(categoryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateAdminCategory = createAsyncThunk(
  "category/updateAdminCategory",
  async ({ categoryId, categoryData }, thunkAPI) => {
    try {
      const response = await updateCategory({ categoryId, categoryData });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteAdminCategory = createAsyncThunk(
  "category/deleteAdminCategory",
  async (categoryId, thunkAPI) => {
    try {
      await deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAdminCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createAdminCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAdminCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
      })

      .addCase(deleteAdminCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;