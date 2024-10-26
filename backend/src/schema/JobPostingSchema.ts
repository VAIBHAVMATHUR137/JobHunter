import mongoose, { Document, Schema } from "mongoose";

interface EachJobPosting extends Document {
  _id: mongoose.Types.ObjectId;
  job_role: string;
  CTC: number;
  experience_required: string;
  years_of_experience_required: number;
  degree_required: string;
  bond: string;
  job_location: string;
  company: string;
  skills_required: string[];
  recruiterId: mongoose.Types.ObjectId;
  recruiterEmail: string;

}

const jobPostingSchema: Schema = new mongoose.Schema({
  job_role: {
    type: String,
    required: true
  },
  CTC: {
    type: Number,
    required: true
  },
  experience_required: {
    type: String,
    required: true
  },
  years_of_experience_required: {
    type: Number,
    required: true
  },
  degree_required: {
    type: [String],
    required: true
  },
  bond: {
    type: String,
    required: true
  },
  job_location: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  skills_required: {
    type: [String],
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Recruiter'
  },
  recruiterEmail: {
    type: String,
    required: true
  },

});

const JobPosting = mongoose.model<EachJobPosting>("JobPosting", jobPostingSchema);

export default JobPosting;