import mongoose, { Document, Schema } from "mongoose";

type Gender = "male" | "female" | "transgender";

// Define interfaces for School Education
interface SchoolEducation {
  school_name: string;
  percentage_obtained: string;
  year_of_passing: string;
  school_board: string;
}

interface CollegeEducation {
  programme_name: string;
  specialization: string;
  college_name: string;
  university_name: string;
  cgpa: string;
  duration: string;
  year_of_commencement: string;
  year_of_conclusion: string;
}

interface InternshipExperience {
  date_of_commencement: string;
  date_of_conclusion: string;
  company: string;
  duration: string;
  roles_and_responsibilities: string;
  stipend: string;
}

interface JobExperience {
  company: string;
  designation: string;
  date_of_commencement: string;
  date_of_resignation: string;
  duration_of_service: string;
  job_description: string;
  annual_ctc: string;
}

interface CurrentJob {
  company: string;
  job_description: string;
  date_of_commencement: string;
  current_role: string;
  years_of_experience: string;
  current_location: string;
}

interface CertificateCourse {
  platform_name: string;
  mentor_name: string;
  title_of_course: string;
  learning_description: string;
  date_of_commencement: string;
  date_of_conclusion: string;
}

interface ICandidate extends Document {
  photo: string;
  firstName: string;
  lastName: string;
  title: string;
  one_liner_intro: string;
  number: string;
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
  core_skills: string[];
  certificate_courses: CertificateCourse[];
  current_job: CurrentJob;
}

const candidateSchema: Schema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
  },
  one_liner_intro: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
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
  tenth_standard_education: {
    type: Object,
    required: true,
  },
  twelth_standard_education: {
    type: Object,
    required: true,
  },
  college_education: {
    type: [Object],
    required: true,
  },
  internship_experience: {
    type: [Object],
    required: true,
  },
  work_experience: {
    type: [Object],
    required: true,
  },
  core_skills: {
    type: [String],
    required: true,
  },
  certificate_courses: {
    type: [Object],
    required: true,
  },
  current_job: {
    type: Object,
    required: true,
  },
});

const Candidate = mongoose.model<ICandidate>("Candidate", candidateSchema);
export default Candidate;
