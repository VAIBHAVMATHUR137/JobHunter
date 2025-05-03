import mongoose, { Document, Schema } from "mongoose";

type WorkEnvironment = "Remote" | "Hybrid" | "On-site";
type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract-based"
  | "Project-based"
  | "Internship";

interface IndividualJobPosting extends Document {
  designation: string;
  job_role: string;
  CTC: {
    minCTC: number;
    maxCTC: number;
  };
  experience_required_in_months: string;
  fresher_eligible: boolean;
  degree_required: string[];
  bond: string;
  work_environment: WorkEnvironment;
  job_location: string;
  company_name: string;
  skills_required: string[];
  type_of_employment: EmploymentType;
  perks_and_benefits: string;
  required_languages: string[];
  visa_sponsorship_available: boolean;
  username:string
}

const jobPostingSchema: Schema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
  job_role: {
    type: String,
    required: true,
  },
  CTC: {
    minCTC: {
      type: Number,
      required: true,
    },
    maxCTC: {
      type: Number,
      required: true,
    },
  },
  experience_required_in_months: {
    type: String,
    required: true,
  },
  fresher_eligible: {
    type: Boolean,
    required: true,
  },
  degree_required: {
    type: [String],
    required: true,
  },
  bond: {
    type: String,
    required: true,
  },
  work_environment: {
    type: String,
    required: true,
    enum: ["Remote", "Hybrid", "On-site"],
  },
  job_location: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  skills_required: {
    type: [String],
    required: true,
  },
  type_of_employment: {
    type: String,
    required: true,
    enum: [
      "Full-time",
      "Part-time",
      "Contract-based",
      "Project-based",
      "Internship",
    ],
  },
  perks_and_benefits: {
    type: String,
    required: true,
  },
  required_languages: {
    type: [String],
    required: true,
  },
  visa_sponsorship_available: {
    type: Boolean,
    required: true,
  },
  username: {
    type: String,
    required: true,
    ref:'Recruiter'
   
  },
});

const JobPosting = mongoose.model<IndividualJobPosting>(
  "JobPosting",
  jobPostingSchema
);

export default JobPosting;
