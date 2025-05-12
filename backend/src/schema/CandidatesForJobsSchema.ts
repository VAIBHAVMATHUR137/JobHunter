import mongoose, { Schema } from "mongoose";
interface CandidateForJob {
  jobID: string;
  candidateUsername: string;

  recruiterUsername: string;
}
const candidateForJobSchema: Schema = new mongoose.Schema({
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
export const CandidateForJobSchema = mongoose.model<CandidateForJob>(
  "CandidateForJobSchema",
  candidateForJobSchema
);
