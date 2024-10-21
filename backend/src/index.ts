import express, { Express } from 'express';
import candidateRoute from "./routes/CandidateRoute";
import recruiterRoute from './routes/RecruiterRoute';
import jobRoute from "./routes/JobPostingRoute"
import cors from 'cors';
import connectDb from './dbConnection';
import dotenv from 'dotenv';
import JobPosting from './schema/JobPostingSchema';

dotenv.config();
connectDb()
const app: Express = express();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});

app.use('/candidate', candidateRoute);
app.use('/recruiter', recruiterRoute);
app.use('/job',jobRoute)