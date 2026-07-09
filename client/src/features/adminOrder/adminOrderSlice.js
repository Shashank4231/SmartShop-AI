import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAdminOrderById,
  getAdminOrders,
  updateAdminOrderStatus,
} from "../../services/adminOrder.service";

export const fetchAdminOrders = createAsyncThunk(
  "adminOrder/fetchAdminOrders",
  async (params, thunkAPI) => {
    try {
      const response = await getAdminOrders(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchAdminOrderDetails = createAsyncThunk(
  "adminOrder/fetchAdminOrderDetails",
  async (orderId, thunkAPI) => {
    try {
      const response = await getAdminOrderById(orderId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const updateAdminOrderStatusThunk = createAsyncThunk(
  "adminOrder/updateAdminOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const response = await updateAdminOrderStatus({ orderId, status });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetAdminSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchAdminOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAdminOrderStatusThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;

        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      });
  },
});

export const { resetAdminSelectedOrder } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;