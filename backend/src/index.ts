import express, { Express } from "express";
import candidateRoute from "./routes/CandidateRoute";
import recruiterRoute from "./routes/RecruiterRoute";
import jobRoute from "./routes/JobPostingRoute";
import jobForCandidate from "./routes/JobApplication";

import cors from "cors";
import connectDb from "./dbConnection";
import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ✅ connect to Redis using the env URL
export const client = new Redis(process.env.REDIS_URL as string);

client.on("connect", () => {
  console.log("✅ Connected to Redis Cloud:", client.options.host);
});

client.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

app.get("/", (req, res) => {
  res.send("JobHunter API is running...");
});

// Configure routes
app.use("/candidate", candidateRoute);
app.use("/recruiter", recruiterRoute);
app.use("/job", jobRoute);
app.use("/applications", jobForCandidate);

// Connect to database and start server
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
