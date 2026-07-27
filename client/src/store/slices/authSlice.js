// store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/signup", credentials);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", credentials);

      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Login failed",
      );
    }
  },
);

// GET CURRENT USER
export const fetchUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await api.get("/auth/me");
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to fetch user",
    );
  }
});

// @desc    Fetch all users (Admin)
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/users");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to fetch users",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    users: [],
    loading: false,
    initializing: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      state.user = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    completeInitialization: (state) => {
      state.initializing = false;
    },
    setUserFromStorage: (state, action) => {
      state.user = action.payload;
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Don't overwrite the logged-in admin user with the signup response
        // action.payload is { message, user } — just keep existing user
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.initializing = false;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearAuthError,
  completeInitialization,
  setUserFromStorage,
} = authSlice.actions;
export default authSlice.reducer;
