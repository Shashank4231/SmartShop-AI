import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/payment.service";

export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async (orderId, thunkAPI) => {
    try {
      const response = await createRazorpayOrder(orderId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to initialise Razorpay payment"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, thunkAPI) => {
    try {
      const response = await verifyRazorpayPayment(paymentData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Payment verification failed"
      );
    }
  }
);

const initialState = {
  paymentOrder: null,
  verifiedOrder: null,
  loading: false,
  verifying: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.paymentOrder = null;
      state.verifiedOrder = null;
      state.loading = false;
      state.verifying = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentOrder = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentOrder = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifying = false;
        state.verifiedOrder = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;