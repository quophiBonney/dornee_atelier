import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

// @desc    Create a new appointment (Public)
export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (appointmentData, thunkAPI) => {
    try {
      const res = await api.post("/appointments", appointmentData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to create appointment",
      );
    }
  },
);

// @desc    Fetch all appointments (Admin)
export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAll",
  async (params, thunkAPI) => {
    try {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      const res = await api.get(`/appointments${query}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to fetch appointments",
      );
    }
  },
);

// @desc    Fetch a single appointment by ID (Admin)
export const fetchAppointmentById = createAsyncThunk(
  "appointment/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/appointments/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to fetch appointment",
      );
    }
  },
);

// @desc    Update appointment (Admin)
export const updateAppointment = createAsyncThunk(
  "appointment/update",
  async ({ id, ...updateData }, thunkAPI) => {
    try {
      const res = await api.put(`/appointments/${id}`, updateData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update appointment",
      );
    }
  },
);

// @desc    Delete appointment (Admin)
export const deleteAppointment = createAsyncThunk(
  "appointment/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/appointments/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to delete appointment",
      );
    }
  },
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
    currentAppointment: null,
    count: 0,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearAppointmentSuccess: (state) => {
      state.successMessage = null;
    },
    resetCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
        state.count += 1;
        state.successMessage = "Appointment created successfully";
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Appointment By ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.appointments.findIndex(
          (a) => a._id === action.payload._id,
        );
        if (idx !== -1) state.appointments[idx] = action.payload;
        if (state.currentAppointment?._id === action.payload._id) {
          state.currentAppointment = action.payload;
        }
        state.successMessage = "Appointment updated successfully";
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (a) => a._id !== action.payload,
        );
        state.count -= 1;
        state.successMessage = "Appointment deleted successfully";
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAppointmentError,
  clearAppointmentSuccess,
  resetCurrentAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
