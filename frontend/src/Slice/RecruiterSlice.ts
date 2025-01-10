import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Define types for School Education
type SchoolEducation = {
  school_name: string;
  percentage_obtained: number;
  year_of_passing: number;
  school_board: string;
};
const initialSchoolEducation: SchoolEducation = {
  school_name: "",
  percentage_obtained: 0,
  year_of_passing: 0,
  school_board: "",
};
//Male or female
type Gender = "male" | "female" | "transgender";
const intialGender: Gender = "male";
//Common login interface declaration for both candidate and recruiter
interface loginFormState {
  username: string;
  password: string;
}
//College Education
interface CollegeEducation {
  programme_name: string;
  specialization: string;
  college_name: string;
  cgpa: number;
  passout_year: number;
}

const initialCollegeEducation: CollegeEducation = {
  programme_name: "",
  specialization: "",
  college_name: "",
  cgpa: 0,
  passout_year: 0,
};

//Internship Experience
interface individual_internship {
  company: string;
  duration: string;
  roles_and_responsibilities: string;
  stipend: string;
}

const initialInternship: individual_internship = {
  company: "",
  duration: "",
  roles_and_responsibilities: "",
  stipend: "",
};

//Job Experience
interface individual_job_experience {
  company:string,
  start_date:Date,
  end_date:Date,
  position:string,
  job_description:string,
  annual_ctc:number,
  
}
const initial_job_experience:individual_job_experience={
  company:"",
  start_date:new Date(),
  end_date:new Date(),
  position:"",
  job_description:"",
  annual_ctc:0
}
//Skills
type coreSkills = string[];
const initialSkills: coreSkills = [];
//Current Job
interface CurrentJob {
  company: string;
  job_description: string;
  since_when: string;
  current_role: string;
}
const initialCurrentJob: CurrentJob = {
  company: "",
  job_description: "",
  since_when: "",
  current_role: "",
};

//interface for first time registration/signin by the recruiter
interface recruiterAuthentication {
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
  tenth_standard_education: SchoolEducation;
  twelth_standard_education: SchoolEducation;
  college_education: CollegeEducation[];
  internship_experience: individual_internship[],
  work_experience: individual_job_experience[],
  core_skills: coreSkills;
  current_job: CurrentJob;
  current_location: string;
  linkedin: string;
  X: string;
  years_of_experience:number
}
const initialRecruiterRegisterState: recruiterAuthentication = {
  firstName: "",
  lastName: "",
  number: 0,
  email: "",
  username: "",
  password: "",
  date_of_birth: new Date(),
  gender: intialGender,
  introduction: "",
  photo: "",
  tenth_standard_education: initialSchoolEducation,
  twelth_standard_education: initialSchoolEducation,
  college_education: [initialCollegeEducation],
  internship_experience: [initialInternship],
  work_experience: [initial_job_experience],
  core_skills: initialSkills,
  current_job: initialCurrentJob,
  current_location: "",
  linkedin: "",
  X: "",
  years_of_experience:0
};
//common reducer to update the field
const loginUpdateField = <T extends keyof loginFormState>(
  state: loginFormState,
  action: PayloadAction<{ field: T; value: loginFormState[T] }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};

//common reducer to reset the field
const loginResetField = <T extends keyof loginFormState>(
  state: loginFormState,
  action: PayloadAction<{ field: T; value: loginFormState[T] }>
) => {
  const { field } = action.payload;
  state[field] = "";
};
//Update the recruiter registration field
const recruiterRegistrationUpdateField = <
  T extends keyof recruiterAuthentication
>(
  state: recruiterAuthentication,
  action: PayloadAction<{ field: T; value: recruiterAuthentication[T] }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};
//RESET the recruiter registration field
const recruiterRegistartionResetField = <T, K extends keyof T>(
  state: T,
  action: PayloadAction<{ field: K; value: T[K] }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};
//seperate slice for recruiter to Login
const recruiterLoginSlice = createSlice({
  name: "recruiterLoginState",
  initialState: initialRecruiterRegisterState,
  reducers: {
    recruiterLoginUpdateField: loginUpdateField,
    recruiterLoginResetField: loginResetField,
  },
});
//Seperate slice for Recruiter to Register first time
const recruiterRegistrationSlice = createSlice({
  name: "recruiterRegistrationSlice",
  initialState: initialRecruiterRegisterState,
  reducers: {
    recruiterRegistrationUpdate: recruiterRegistrationUpdateField,
    recruiterRegistrationReset: recruiterRegistartionResetField,
  },
});
//Actions for recruiter login fields
export const { recruiterLoginUpdateField, recruiterLoginResetField } =
  recruiterLoginSlice.actions;
//Actions for recruiter registration fields
export const { recruiterRegistrationReset, recruiterRegistrationUpdate } =
  recruiterRegistrationSlice.actions;
export const recruiterLoginReducer = recruiterLoginSlice.reducer;
export const recruiterRegistrationReducer = recruiterRegistrationSlice.reducer;
