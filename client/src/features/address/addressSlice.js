import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../services/address.service";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, thunkAPI) => {
    try {
      const response = await getAddresses();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, thunkAPI) => {
    try {
      const response = await addAddress(addressData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ addressId, addressData }, thunkAPI) => {
    try {
      const response = await updateAddress({ addressId, addressData });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const removeAddress = createAsyncThunk(
  "address/removeAddress",
  async (addressId, thunkAPI) => {
    try {
      const response = await deleteAddress(addressId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

export const makeDefaultAddress = createAsyncThunk(
  "address/makeDefaultAddress",
  async (addressId, thunkAPI) => {
    try {
      const response = await setDefaultAddress(addressId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set default address"
      );
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
    resetAddresses: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })

      .addCase(removeAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })

      .addCase(makeDefaultAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export const { clearAddressError, resetAddresses } = addressSlice.actions;
export default addressSlice.reducer;