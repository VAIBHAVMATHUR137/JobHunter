import mongoose, { Schema } from "mongoose";
interface JobApplication {
  jobID: string;
  candidateUsername: string;

  recruiterUsername: string;
}
const JobApplication: Schema = new mongoose.Schema({
  jobID: {
    type: String,
    required: true,
  },
  candidateUsername: {
    type: String,
    required: true,
  },
  recruiterUsername: {
    type: String,
    required: true,
  },
});
export const JobApplicationSchema = mongoose.model<JobApplication>(
  "JobApplicationSchema",
  JobApplication
);
