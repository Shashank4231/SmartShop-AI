import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductBySlug, getProducts } from "../../services/product.service";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, thunkAPI) => {
    try {
      const response = await getProducts(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug, thunkAPI) => {
    try {
      const response = await getProductBySlug(slug);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  pagination: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 12,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: action.payload.page || 1,
      };
    },
    clearProductFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProductFilters, clearProductFilters } = productSlice.actions;
export default productSlice.reducer;