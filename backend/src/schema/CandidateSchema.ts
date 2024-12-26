import mongoose, { Document, Schema } from 'mongoose';
const mobileNumberRegex: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
// Define the interface for the schema
interface ICandidate extends Document {
  firstName:string,
  lastName:string,
  email: string;
  number: number;
  password: string;
  current_location: string;
  degree: string;
  skills: string[];
  college_name: string;
  college_tier: string;
  preferred_location: string[];
  notice_period: number;
  years_of_experience: number;
  github: string;
  xProfile?: string;    
  linkedin: string;
  portfolio?: string;    
  photo: string;
  resume: string;
}

// Create the candidate schema
const candidateSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    required: [true, "Mobile number is required"],
    unique: true,
    validate: {
      validator: (value: string) => mobileNumberRegex.test(value),
      message: "Please enter a valid mobile number.",
    },
  },
  password: {
    type: String,
    required: true

  },
  current_location: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  college_name: {
    type: String,
    required: true,
  },
  college_tier: {
    type: String,
    required: true,
  },
  preferred_location: {
    type: [String],
    required: true,
  },
  notice_period: {
    type: Number,
    required: true,
  },
  years_of_experience: {
    type: Number,
    required: true,
  },

  github: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid GitHub URL!`,
    },
  },
  xProfile: {
    type: String,
    required: false, // Optional field
    validate: {
      validator: (v: string) => /^(https?:\/\/)?(www\.)?(x|twitter)\.com\/[a-zA-Z0-9_]+$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid X/Twitter URL!`,
    },
  },
  linkedin: {
    type: String,
    required: true,

  },
  portfolio: {
    type: String,
    required: false,
    validate: {
      validator: (v: string) => /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid portfolio URL!`,
    },
  },
  photo: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^https:\/\/drive\.google\.com\/.*/.test(value),
      message: 'Please provide a valid Google Drive link for your resume.',
    },
  },

});

// Export the model
const Candidate = mongoose.model<ICandidate>('Candidate', candidateSchema);
export default Candidate;
