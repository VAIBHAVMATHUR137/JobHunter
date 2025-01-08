import mongoose, { Document, Schema } from "mongoose";

// Regex patterns
const mobileNumberRegex: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
type Gender = "male" | "female" | "transgender";

// Define interfaces for nested objects
interface SchoolEducation {
  school_name: string;
  percentage_obtained: number,
  year_of_passing: number;
  school_board:string
}

type CollegeEducation=[];

type InternshipExperience =[];

type JobExperience=[];

interface CurrentJob {
  company: string;
  job_description:string,
  since_when: string;
  current_role:string
}

interface IRecruiter extends Document {
  firstName: string;
  lastName: string;
  number: number;
  date_of_birth: Date;
  email: string;
  username: string;
  password: string;
  gender: Gender;
  introduction: string;
  photo: string;
  tenth_standard_education: SchoolEducation[];
  twelth_standard_education: SchoolEducation[];
  college_education: CollegeEducation[];
  internship_experience: InternshipExperience[];
  work_experience: JobExperience[];
  core_skills: string[];
  current_job: CurrentJob[];
  current_location: string;
  linkedin: string;
  X: string;
}

const recruiterSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  date_of_birth:{
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date): boolean {
        if (!(value instanceof Date)) {
          return false;
        }
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        console.log(age);
        const monthDiff = today.getMonth() - value.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
          return age - 1 >= 18 && age - 1 <= 100;
        }
        
        return age >= 18 && age <= 100;
      },
      message: "Invalid date of birth. Must be 18-100 years old and not in the future"
    }
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
  photo: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "transgender"],
  },
  linkedin: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9\-]+\/?$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid LinkedIn URL!`,
    },
  },
  X: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(https?:\/\/)?(www\.)?(x|twitter)\.com\/[a-zA-Z0-9_]+$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid X/Twitter URL!`,
    },
  },
  introduction: {
    type: String,
    required: true,
  },
  tenth_standard_education: [{
    school_name: String,
    percentage_obtained: Number,
    year_of_passing: Number,
    school_board:String
  }],
  twelth_standard_education: [{
    school_name: String,
    percentage_obtained: Number,
    year_of_passing: Number,
    school_board:String
  }],
  college_education: [],
  internship_experience: [],
  work_experience: [],
  core_skills: {
    type: [String],
    required: true,
  },
  current_job: [{
    company: String,
    since_when: String,
    job_location: String,
    current_role:String
  }],
  current_location: {
    type: String,
    required: true,
  },
  
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);
// Define virtual property with proper this typing
recruiterSchema.virtual('age').get(function(this: { date_of_birth: Date }) {
  if (!this.date_of_birth) return null;
  
  const today = new Date();
  const birthDate = this.date_of_birth;
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

const Recruiter = mongoose.model<IRecruiter>("Recruiter", recruiterSchema);
export default Recruiter;