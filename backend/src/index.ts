import express, { Express } from "express";
import candidateRoute from "./routes/CandidateRoute";
import recruiterRoute from "./routes/RecruiterRoute";
import jobRoute from "./routes/JobPostingRoute";
import UserNameRoute from "./routes/UserNameRoute"
import cors from "cors";
import connectDb from "./dbConnection";
import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

export const client=new Redis();

// Configure routes
app.use("/candidate", candidateRoute);
app.use("/recruiter", recruiterRoute);
app.use("/job", jobRoute);
app.use('/UserName',UserNameRoute)

// Connect to database and start server
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
