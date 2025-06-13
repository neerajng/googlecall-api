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
import twilio from 'twilio';

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

// Cron Function to check upcoming events
const checkUpcomingEvents = async () => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("Checking for upcoming events...");
    // const uuid =Utils.Jwt.  

    // 1. Get current time and 5 minutes from now
    const now = new Date();
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
    
    // 2. Get upcoming events from database
    const events = await DB.auth.checkEvents(process.env.CURRENT_USER_ID! ,now, fiveMinutesLater);

    
    // 3. Call the user
    if (events.count > 0 && events.phone) {
      const message = `Reminder: You have an event starting soon. Title: ${events.firstEvent.summary}.`;

      console.log(process.env.TWILIO_PHONE_NUMBER,`Calling ${events.phone}...`);

      const call = await client.calls.create({
        twiml: `<Response><Say voice="alice">${message}</Say></Response>`,
        to: `+91${events.phone}`, // Add country code if needed
        from: process.env.TWILIO_PHONE_NUMBER!,
      });

      console.log(`Call initiated. SID: ${call.sid}`);
    } else {
      console.log("No upcoming events or missing phone number.");
    }
    
    
  } catch (error) {
    console.error("Error in checkUpcomingEvents:", error);
  }
};
//cronjob
cron.schedule("*/10 * * * * *", checkUpcomingEvents);

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

