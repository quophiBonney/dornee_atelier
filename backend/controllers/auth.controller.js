import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// import redisClient from "../config/redis.js";
// import { sendOTP } from "../utils/sendOtp.js";

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
const OTP_COOLDOWN_SECONDS = 60; // 1 minute between resend requests
const LOGIN_ATTEMPT_WINDOW_SECONDS = 15 * 60; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const otpKey = (email) => `auth:otp:${normalizeEmail(email)}`;
const otpCooldownKey = (email) => `auth:otp:cooldown:${normalizeEmail(email)}`;
const loginAttemptsKey = (email, ip) =>
  `auth:login:attempts:${normalizeEmail(email)}:${ip || "unknown"}`;
const sessionKey = (userId, jti) => `auth:session:${userId}:${jti}`;
const userCacheKey = (userId) => `auth:user:${userId}`;

const safeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
});

const issueJwtAndCacheSession = async (user) => {
  const jti = crypto.randomUUID();

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      jti,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const storeVerificationOtp = async (email, userId) => {
  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 10);

  const payload = {
    userId: String(userId),
    hash: hashedOTP,
    attempts: 0,
    createdAt: Date.now(),
  };

  // await redisClient.setEx(
  //   otpKey(email),
  //   OTP_TTL_SECONDS,
  //   JSON.stringify(payload),
  // );

  // await redisClient.setEx(otpCooldownKey(email), OTP_COOLDOWN_SECONDS, "1");

  return otp;
};

// const getOtpRecord = async (email) => {
//   const raw = await redisClient.get(otpKey(email));
//   if (!raw) return null;

//   try {
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// };

// const saveOtpRecord = async (email, record) => {
//   // await redisClient.setEx(
//   //   otpKey(email),
//   //   OTP_TTL_SECONDS,
//   //   JSON.stringify(record),
//   // );
// };

export const signup = async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    if (!payload.length) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const results = [];
    const errors = [];

    for (const userData of payload) {
      try {
        const { role, email, password } = userData || {};
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !password) {
          throw new Error("All fields are required");
        }

        if (String(password).length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(501).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user;
        user = await User.create({
          email: normalizedEmail,
          password: hashedPassword,
          role,
        });
        results.push(safeUser(user));
      } catch (error) {
        errors.push({
          email: normalizeEmail(userData?.email),
          message: error.message,
        });
      }
    }

    if (payload.length === 1) {
      if (errors.length) {
        return res.status(400).json({ message: errors[0].message });
      }

      return res.status(201).json({
        message: "Signup successful.",
        user: results[0],
      });
    }

    return res.status(201).json({
      message: "Bulk signup completed",
      createdCount: results.length,
      failedCount: errors.length,
      createdUsers: results,
      errors,
    });
  } catch (error) {
    console.error("signup:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// Verify OTP
// ─────────────────────────────────────────────────────────────

// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const normalizedEmail = normalizeEmail(email);

//     if (!normalizedEmail || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       // await redisClient.del(otpKey(normalizedEmail));
//       // await redisClient.del(otpCooldownKey(normalizedEmail));
//       return res.status(400).json({ message: "Account already verified" });
//     }

//     const otpRecord = await getOtpRecord(normalizedEmail);

//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP expired or not found" });
//     }

//     if (otpRecord.attempts >= 5) {
//       // await redisClient.del(otpKey(normalizedEmail));
//       return res
//         .status(429)
//         .json({ message: "Too many OTP attempts. Please resend a new OTP." });
//     }

//     const isValidOTP = await bcrypt.compare(String(otp), otpRecord.hash);

//     if (!isValidOTP) {
//       otpRecord.attempts += 1;
//       await saveOtpRecord(normalizedEmail, otpRecord);

//       return res.status(400).json({
//         message: "Invalid OTP",
//         remainingAttempts: Math.max(5 - otpRecord.attempts, 0),
//       });
//     }

//     user.isVerified = true;
//     await user.save();

//     // await redisClient.del(otpKey(normalizedEmail));
//     // await redisClient.del(otpCooldownKey(normalizedEmail));

//     const token = await issueJwtAndCacheSession(user);

//     return res.json({
//       message: "Account verified successfully",
//       token,
//       user: safeUser(user),
//     });
//   } catch (error) {
//     console.error("verifyOTP:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// ─────────────────────────────────────────────────────────────
// Resend OTP
// ─────────────────────────────────────────────────────────────

// export const resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const normalizedEmail = normalizeEmail(email);

//     if (!normalizedEmail) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "Account already verified" });
//     }

//     // const cooldown = await redisClient.ttl(otpCooldownKey(normalizedEmail));
//     // if (cooldown > 0) {
//     //   return res.status(429).json({
//     //     message: `Please wait ${cooldown} seconds before requesting another OTP`,
//     //   });
//     // }

//     const otp = await storeVerificationOtp(normalizedEmail, user._id);
//     await sendOTP(normalizedEmail, otp);

//     return res.json({ message: "OTP resent successfully" });
//   } catch (error) {
//     console.error("resendOTP:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const attemptsKey = loginAttemptsKey(normalizedEmail, ip);

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // const currentAttempts = Number((await redisClient.get(attemptsKey)) || 0);
    // if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
    //   return res.status(429).json({
    //     message: "Too many login attempts. Please try again later.",
    //   });
    // }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      // const nextAttempts = await redisClient.incr(attemptsKey);
      // if (nextAttempts === 1) {
      //   await redisClient.expire(attemptsKey, LOGIN_ATTEMPT_WINDOW_SECONDS);
      // }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // const nextAttempts = await redisClient.incr(attemptsKey);
      // if (nextAttempts === 1) {
      //   await redisClient.expire(attemptsKey, LOGIN_ATTEMPT_WINDOW_SECONDS);
      // }
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // await redisClient.del(attemptsKey);
    const { accessToken, refreshToken } = await issueJwtAndCacheSession(user);

    return res.json({
      accessToken,
      refreshToken,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("login:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
          algorithms: ["HS256"],
        });
        // if (decoded?.id && decoded?.jti) {
        //   // await redisClient.del(sessionKey(decoded.id, decoded.jti));
        // }
      } catch {
        // ignore invalid token on logout
      }
    }
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("logout:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        jti: decoded.jti,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.json({
      accessToken,
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(201).json(users);
  } catch (err) {
    return res.status(501).json({ message: "Internal server error" });
  }
};
