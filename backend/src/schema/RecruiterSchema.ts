import mongoose, { Document, Schema } from "mongoose";

// Regex patterns
const mobileNumberRegex: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
type Gender = "male" | "female" | "transgender";

// Define interfaces for School Education
interface SchoolEducation {
  school_name: string;
  percentage_obtained: number;
  year_of_passing: string;
  school_board: string;
}

interface CollegeEducation {
  programme_name: string;
  specialization: string;
  college_name: string;
  university_name: string;
  cgpa: number;
  duration: number;
  year_of_commencement: string;
  year_of_conclusion: string;
}
interface InternshipExperience {
  date_of_commencement: string;
  date_of_conclusion: string;
  company: string;
  duration: number;
  roles_and_responsibilities: string;
  stipend: string;
}

interface JobExperience {
  company: string;
  designation: string;
  date_of_commencement: string;
  date_of_resignation: string;
  duration_of_service: number;
  job_description: string;
  annual_ctc: number;
}

interface CurrentJob {
  company: string;
  job_description: string;
  date_of_commencement: string;
  current_role: string;
  years_of_experience: number;
  current_location:string
}

interface CertificateCourse {
  platform_name: string;
  mentor_name: string;
  title_of_course: string;
  learning_description: string;
  date_of_commencement: string;
  date_of_conclusion: string;
}

interface IRecruiter extends Document {
  photo: string;
  firstName: string;
  lastName: string;
  title: string;
  one_liner_intro: string;
  number: number;
  email: string;
  username: string;
  password: string;
  gender: Gender;
  introduction: string;
  tenth_standard_education: SchoolEducation;
  twelth_standard_education: SchoolEducation;
  college_education: CollegeEducation[];
  internship_experience: InternshipExperience[];
  work_experience: JobExperience[];
  core_skills: [];
  certificate_courses: CertificateCourse[];
  current_job: CurrentJob;
  current_location: string;
}

const recruiterSchema: Schema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  number: {
    type: String,
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

  introduction: {
    type: String,
    required: true,
  },
  tenth_standard_education: 
    {
      school_name: String,
      percentage_obtained: Number,
      year_of_passing: String,
      school_board: String,
    },
  
  twelth_standard_education: 
    {
      school_name: String,
      percentage_obtained: Number,
      year_of_passing: String,
      school_board: String,
    },
  
  college_education: [
    {
      programme_name: String,
      specialization: String,
      college_name: String,
      university_name: String,
      cgpa: Number,
      duration: Number,
      year_of_commencement: String,
      year_of_conclusion: String,
    },
  ],
  internship_experience: [
    {
      date_of_commencement: String,
      date_of_conclusion: String,
      company: String,
      duration: Number,
      roles_and_responsibilities: String,
      stipend: String,
    },
  ],
  work_experience: [
    {
      company: String,
      designation: String,
      date_of_commencement: String,
      date_of_resignation: String,
      duration_of_service: Number,
      job_description: String,
      annual_ctc: Number,
    },
  ],
  core_skills: {
    type: [String],
    required: true,
  },
  current_job: 
    {
      company: String,
      job_description: String,
      date_of_commencement: String,
      current_role: String,
      years_of_experience: Number,
      current_location: String,
    },
  
});

const Recruiter = mongoose.model<IRecruiter>("Recruiter", recruiterSchema);
export default Recruiter;
