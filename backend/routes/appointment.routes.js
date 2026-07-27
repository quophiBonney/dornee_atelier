import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - anyone can book an appointment
router.post("/", createAppointment);

// Protected routes - admin only
router.get(
  "/",
  authMiddleware,
  authorizeRoles("superadmin", "admin", "support"),
  getAppointments,
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("superadmin", "admin", "support"),
  getAppointmentById,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  updateAppointment,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  deleteAppointment,
);

export default router;
