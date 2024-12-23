import mongoose, { Document, Schema } from "mongoose";

// Regex patterns

const mobileNumberRegex: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

interface IRecruiter extends Document {
  name: string;
  number: number;
  email: string;
  password: string;
  company: string;
  location: string;
  photo: string;
}
const recruiterSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});
const Recruiter = mongoose.model<IRecruiter>("Recruiter", recruiterSchema);
export default Recruiter;
