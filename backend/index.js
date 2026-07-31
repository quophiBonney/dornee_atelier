import dotenv from "dotenv";
import dns from "dns";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { connectDB } from "./config/db.connection.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "https://dorneeatelier.com",
  "https://dorneeatelier.com/auth/login",
  "http://localhost:5173",
  "https://dornee-atelier.vercel.app",
  "https://dorneeatelier.com/",
  "*",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(helmet());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h3>Welcome to Dornee API</h3>");
});
app.use("/api/v1/", authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/contacts", contactRoutes);
export default app;
