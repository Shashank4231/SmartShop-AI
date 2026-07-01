import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../services/cart.service";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await getCart();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const response = await addToCart({ productId, quantity });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  }
);

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const response = await updateCartItem({ productId, quantity });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async ({ productId }, thunkAPI) => {
    try {
      const response = await removeCartItem({ productId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove product"
      );
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, thunkAPI) => {
    try {
      const response = await clearCart();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const initialState = {
  cart: null,
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const updateCartState = (state, cart) => {
  state.cart = cart;
  state.items = cart?.items || [];
  state.subtotal = cart?.subtotal || 0;
  state.shipping = cart?.shipping || 0;
  state.discount = cart?.discount || 0;
  state.total = cart?.total || 0;
  state.totalItems = cart?.totalItems || 0;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProductQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProductFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;