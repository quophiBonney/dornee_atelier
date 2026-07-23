// store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../utils/api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/register", credentials);
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
    console.log("🔥 THUNK STARTED");

    try {
      const res = await api.post("/login", credentials);

      console.log("🔥 API RESPONSE:", res.data);

      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const user = res.data.user;

      console.log("🔥 ACCESS:", accessToken);
      console.log("🔥 REFRESH:", refreshToken);
      console.log("🔥 USER:", user);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("🔥 STORAGE USER:", localStorage.getItem("user"));

      return user;
    } catch (err) {
      console.log("🔥 THUNK ERROR:", err);

      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Login failed",
      );
    }
  },
);

export const fetchUsers = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to fetch users",
    );
  }
});
// GET CURRENT USER
export const fetchUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to fetch user",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    initializing: true, // Track if auth is being initialized
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
      .addCase(fetchUsers.pending, (state) => {
        state.initializing = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.user = null;
        state.initializing = false;
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
