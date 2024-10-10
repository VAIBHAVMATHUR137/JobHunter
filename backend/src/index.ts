import express, { Express, Request, Response } from 'express';
import candidateRoute from "./routes/CandidateRoute"
import recruiterRoute from './routes/RecruiterRoute'
import cors from 'cors';
const app: Express = express();
const port = 3000;
app.use(cors())
app.use(express.json())

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.use('/candidate',candidateRoute)
app.use('/recruiter',recruiterRoute)