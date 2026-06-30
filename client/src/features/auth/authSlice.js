import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../../services/auth.service";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await registerUser(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await loginUser(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, thunkAPI) => {
    try {
      const refreshResponse = await refreshAccessToken();
      const accessToken = refreshResponse.data.accessToken;

      const userResponse = await getCurrentUser(accessToken);

      return {
        user: userResponse.data,
        accessToken,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Session expired. Please login again.");
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logoutUser();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load Current User
      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;