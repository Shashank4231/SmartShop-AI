import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAdminUserById,
  getAdminUsers,
  toggleUserBlock,
  updateUserRole,
} from "../../services/user.service";

export const fetchAdminUsers = createAsyncThunk(
  "adminUser/fetchUsers",
  async (params = {}, thunkAPI) => {
    try {
      const response = await getAdminUsers(params);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchAdminUserDetails = createAsyncThunk(
  "adminUser/fetchUserDetails",
  async (userId, thunkAPI) => {
    try {
      const response = await getAdminUserById(userId);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  }
);

export const updateUserRoleThunk = createAsyncThunk(
  "adminUser/updateRole",
  async ({ userId, role }, thunkAPI) => {
    try {
      const response = await updateUserRole(userId, role);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  }
);

export const toggleUserBlockThunk = createAsyncThunk(
  "adminUser/toggleBlock",
  async (userId, thunkAPI) => {
    try {
      const response = await toggleUserBlock(userId);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    clearAdminUserError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single user details
      .addCase(fetchAdminUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedUser = null;
      })
      .addCase(fetchAdminUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchAdminUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user role
      .addCase(updateUserRoleThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        if (
          state.selectedUser?.user?._id === action.payload._id
        ) {
          state.selectedUser.user = {
            ...state.selectedUser.user,
            ...action.payload,
          };
        }
      })
      .addCase(updateUserRoleThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Block or unblock user
      .addCase(toggleUserBlockThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleUserBlockThunk.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        if (
          state.selectedUser?.user?._id === action.payload._id
        ) {
          state.selectedUser.user = {
            ...state.selectedUser.user,
            ...action.payload,
          };
        }
      })
      .addCase(toggleUserBlockThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedUser,
  clearAdminUserError,
} = adminUserSlice.actions;

export default adminUserSlice.reducer;