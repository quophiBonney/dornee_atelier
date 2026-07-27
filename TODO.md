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

All changes implemented:
