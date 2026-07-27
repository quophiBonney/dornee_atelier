import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import appointmentReducer from "./slices/appointmentSlice";
import contactReducer from "./slices/contactSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    contact: contactReducer,
  },
});
