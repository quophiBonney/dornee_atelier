import { Router } from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - anyone can submit a contact enquiry
router.post("/", createContact);

// Protected routes - admin only
router.get(
  "/",
  authMiddleware,
  authorizeRoles("superadmin", "admin", "support"),
  getContacts,
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("superadmin", "admin", "support"),
  getContactById,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  updateContact,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  deleteContact,
);

export default router;
