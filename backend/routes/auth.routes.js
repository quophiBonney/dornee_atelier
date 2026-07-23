import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  fetchUsers,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/refresh", refreshToken);
router.post("/auth/logout", authMiddleware, logout);
router.get("/auth/users", authMiddleware, fetchUsers);
export default router;
