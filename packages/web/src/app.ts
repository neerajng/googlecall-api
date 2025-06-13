import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import cron from "node-cron"
import DB from "@googlecall/db";
import Utils from "@googlecall/utils";
import { errorHandler } from "./middlewares";
import apiRoutes from "./routes";

const app = express();

// Database connection initialization
DB.connection.client.initialize();

// Middlewares
app.use(express.json());
app.use(helmet());

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN, // Allow app domain only
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies to be sent
  }),
);

app.use(compression());
app.use(cookieParser());

// Routes
app.use("/api", apiRoutes);

//cronjob
cron.schedule("*/20 * * * * *", Utils.TwilioCall.checkForCalling);

// Unhandled Rejection
process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
});

// Uncaught Exception
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Centralized Error-Handling Middleware
app.use(errorHandler);

export default app;

