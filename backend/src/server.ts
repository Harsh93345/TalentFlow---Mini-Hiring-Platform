import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import candidatesRouter from "./routes/candidates.js";
import jobsRouter from "./routes/jobs.js";
import candidateTimelineRouter from "./routes/candidateTimeline.js";
import assessmentsRouter from "./routes/assessments.js";
import assessmentResponsesRouter from "./routes/assessmentResponses.js";

const app = express();

// CORS: allow frontend origin(s). When using credentials, origin must be explicit (not "*").
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://talent-flow-mini-hiring-platform-two.vercel.app/",
];
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. Postman, same-origin proxy)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// API routes
app.use("/api/candidates", candidatesRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/candidate-timeline", candidateTimelineRouter);
app.use("/api/assessments", assessmentsRouter);
app.use("/api/assessment-responses", assessmentResponsesRouter);

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB", err);
    process.exit(1);
  });