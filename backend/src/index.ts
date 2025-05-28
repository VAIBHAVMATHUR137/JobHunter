import express, { Express } from "express";
import candidateRoute from "./routes/CandidateRoute";
import recruiterRoute from "./routes/RecruiterRoute";
import jobRoute from "./routes/JobPostingRoute";
import jobForCandidate from "./routes/JobApplication"

import cors from "cors";
import connectDb from "./dbConnection";
import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

export const client=new Redis({
  host: 'redis-17811.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
  port: 17811,
  username: 'default', 
  password: process.env.REDIS_PASSWORD,

});

app.get('/', (req, res) => {
  res.send('JobHunter API is running...');
});


console.log('Connected to Redis at:', client.options.host);

// Configure routes
app.use("/candidate", candidateRoute);
app.use("/recruiter", recruiterRoute);
app.use("/job", jobRoute);
app.use('/applications',jobForCandidate)



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