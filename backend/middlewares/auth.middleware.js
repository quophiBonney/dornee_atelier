import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      _id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          error: `Forbidden: ${roles.join(", ")} only`,
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};
