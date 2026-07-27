# TODO: Add Actions Column to Appointments Table

## Steps

### Backend

- [x] Create `backend/services/email.service.js` - Email sending service using nodemailer
- [x] Update `backend/controllers/appointment.controller.js` - Send email notification when status changes
- [x] Verify email service works with existing `.env` config

### Frontend (AdminDashboard.jsx)

- [x] Add "Actions" column to appointments DataTable with Update Status & Delete buttons
- [x] Add `StatusUpdateModal` component with status selection
- [x] Add `DeleteConfirmModal` component with confirmation dialog
- [x] Wire up Redux `updateAppointment` and `deleteAppointment` dispatches

## Completed ✓

### Bug Fix: Redirect after creating user from dashboard

**Root Cause:** `registerUser.fulfilled` reducer was overwriting `state.user` with the signup response payload (`{ message, user }`) instead of preserving the logged-in admin user. This corrupted the auth state.

**Fixes applied to `client/src/store/slices/authSlice.js`:**

1. **`loginUser` thunk** — Now also saves `refreshToken` to localStorage so the axios interceptor can refresh expired tokens without crashing the session
2. **`logout` reducer** — Fixed to remove `"accessToken"` and `"refreshToken"` instead of the non-existent `"token"` key
3. **`registerUser.fulfilled` reducer** — Removed `state.user = action.payload` (which was setting user to `{ message, user }` signup response), now preserves the existing admin user in state
