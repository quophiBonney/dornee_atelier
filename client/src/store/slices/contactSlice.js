import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

// @desc    Submit a contact/enquiry form (Public)
export const submitContact = createAsyncThunk(
  "contact/submit",
  async (contactData, thunkAPI) => {
    try {
      const res = await api.post("/contacts", contactData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to submit enquiry",
      );
    }
  },
);

// @desc    Fetch all contact enquiries (Admin)
export const fetchContacts = createAsyncThunk(
  "contact/fetchAll",
  async (params, thunkAPI) => {
    try {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      const res = await api.get(`/contacts${query}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to fetch enquiries",
      );
    }
  },
);

// @desc    Fetch a single contact enquiry by ID (Admin)
export const fetchContactById = createAsyncThunk(
  "contact/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/contacts/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to fetch enquiry",
      );
    }
  },
);

// @desc    Update contact enquiry (Admin)
export const updateContact = createAsyncThunk(
  "contact/update",
  async ({ id, ...updateData }, thunkAPI) => {
    try {
      const res = await api.put(`/contacts/${id}`, updateData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update enquiry",
      );
    }
  },
);

// @desc    Delete contact enquiry (Admin)
export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/contacts/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to delete enquiry",
      );
    }
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contacts: [],
    currentContact: null,
    count: 0,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
    clearContactSuccess: (state) => {
      state.successMessage = null;
    },
    resetCurrentContact: (state) => {
      state.currentContact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Contact
      .addCase(submitContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.unshift(action.payload);
        state.count += 1;
        state.successMessage = "Enquiry submitted successfully";
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Contact By ID
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContact = action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.contacts.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (idx !== -1) state.contacts[idx] = action.payload;
        if (state.currentContact?._id === action.payload._id) {
          state.currentContact = action.payload;
        }
        state.successMessage = "Enquiry updated successfully";
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter((c) => c._id !== action.payload);
        state.count -= 1;
        state.successMessage = "Enquiry deleted successfully";
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactError, clearContactSuccess, resetCurrentContact } =
  contactSlice.actions;

export default contactSlice.reducer;
