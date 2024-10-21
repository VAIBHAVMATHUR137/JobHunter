import mongoose, { Document, Schema } from "mongoose";

interface EachJobPosting extends Document {
  job_role: String;
  CTC: String;
  experienced_required: boolean;
  years_of_experience_required: number;
  degree_required: string[];
  bond: String;
  job_location: string;
  company: string;
  skills_required: string[];
}

const jobPostingSchema: Schema = new mongoose.Schema({
  job_role: {
    name: String,
    required: true,
  },
  CTC: {
    name: Number,
    required: true,
  },
  experienced_required: {
    name: Boolean,
    required: true,
  },
  years_of_experienced_required: {
    name: Number,
    required: true,
  },
  degree_required: {
    name: [String],
    required: true,
  },
  bond: {
    name: String,
    required: true,
  },
  job_location: {
    name: String,
    required: true,
  },
  company: {
    name: String,
    required: true,
  },
  skills_required: {
    name: [String],
    required: true,
  },
});
const JobPosting = mongoose.model<EachJobPosting>(
  "JobPosting",
  jobPostingSchema
);
export default JobPosting;
