import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Define types for School Education
type SchoolEducation = {
  school_name: string;
  percentage_obtained: number;
  year_of_passing: string;
  school_board: string;
};
const initialSchoolEducation: SchoolEducation = {
  school_name: "",
  percentage_obtained: 0,
  year_of_passing: "",
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
const initialLoginState:loginFormState={
  username:"",
  password:""
}
//College Education
interface CollegeEducation {
  programme_name: string;
  specialization: string;
  college_name: string;
  university_name:string,
  cgpa: number;
  duration:number;
  year_of_commencement:string,
  passout_year: string;
}

const initialCollegeEducation: CollegeEducation = {
  programme_name: "",
  specialization: "",
  college_name: "",
  university_name:"",
  cgpa: 0,
  duration:0,
  year_of_commencement:"",
  passout_year: "",
};

//Internship Experience
interface individual_internship {
  date_of_commencement:string,
  date_of_conclusion:string,
  company: string;
  duration: number;
  roles_and_responsibilities: string;
  stipend: string;
}

const initialInternship: individual_internship = {
  date_of_commencement:"",
  date_of_conclusion:"",
  company: "",
  duration: 0,
  roles_and_responsibilities: "",
  stipend: "",
};

//Job Experience
interface individual_job_experience {
  company: string;
  date_of_commencement: string;
  date_of_conclusion: string;
  duration_of_service:number;
  position: string;
  job_description: string;
  annual_ctc: number;
}
const initial_job_experience: individual_job_experience = {
  company: "",
  date_of_commencement: "",
  date_of_conclusion: "",
  duration_of_service:0,
  position: "",
  job_description: "",
  annual_ctc: 0,
};
//Skills
type coreSkills = string[];
const initialSkills: coreSkills = [];
//Certificate
interface certificate{
  platform_name:string,
  mentor_names:string[],
  title_of_course:string,
  learning_description:string,
  date_of_commencement: string;
  date_of_conclusion: string;
}
const initialCertificateState:certificate={
  platform_name:"",
  mentor_names:[],
  title_of_course:"",
  learning_description:"",
  date_of_commencement:"",
  date_of_conclusion:""
}
//Current Job
interface CurrentJob {
  company: string;
  job_description: string;
  date_of_commencement:string;
  current_role: string;
}
const initialCurrentJob: CurrentJob = {
  company: "",
  job_description: "",
  date_of_commencement: "",
  current_role: "",
};

//interface for first time registration/signin by the recruiter
interface recruiterAuthentication {
  firstName: string;
  lastName: string;
  title:string,
  one_liner_intro:string,
  number: number;
  date_of_birth: string;
  email: string;
  username: string;
  password: string;
  gender: Gender;
  introduction: string;
  photo: string;
  tenth_standard_education: SchoolEducation;
  twelth_standard_education: SchoolEducation;
  college_education: CollegeEducation[];
  internship_experience: individual_internship[];
  work_experience: individual_job_experience[];
  core_skills: coreSkills;
  certificate_courses:certificate[];
  current_job: CurrentJob;
  current_location: string;
  linkedin: string;
  X: string;
  years_of_experience: number;
}
const initialRecruiterRegisterState: recruiterAuthentication = {
  firstName: "",
  lastName: "",
  title:"",
  one_liner_intro:"",
  number: 0,
  email: "",
  username: "",
  password: "",
  date_of_birth: "",
  gender: intialGender,
  introduction: "",
  photo: "",
  tenth_standard_education: initialSchoolEducation,
  twelth_standard_education: initialSchoolEducation,
  college_education: [initialCollegeEducation],
  internship_experience: [initialInternship],
  work_experience: [initial_job_experience],
  core_skills: initialSkills,
  certificate_courses:[initialCertificateState],
  current_job: initialCurrentJob,
  current_location: "",
  linkedin: "",
  X: "",
  years_of_experience: 0,
};
//common reducer to update the field
const loginUpdateField = <T extends keyof loginFormState>(
  state: loginFormState,
  action: PayloadAction<{ field: T; value: loginFormState[T] }>
) => {
  const { field, value } = action.payload;
  return{
    ...state,
    [field]:value
  }
};

//common reducer to reset the field
const loginResetField = <T extends keyof loginFormState>(
  state: loginFormState,
  action: PayloadAction<{ field: T; value: loginFormState[T] }>
) => {
  return {
    ...state,
    [action.payload.field]: initialLoginState[action.payload.field],
  };
};
//Update the recruiter registration field
const recruiterRegistrationUpdateField = <
  T extends keyof recruiterAuthentication
>(
  state: recruiterAuthentication,
  action: PayloadAction<{ field: T; value: recruiterAuthentication[T] }>
) => {
  const { field, value } = action.payload;
  return {
    ...state,
    [field]: value,
  };
};
//RESET the recruiter registration field
const recruiterRegistartionResetField = <
  T extends keyof recruiterAuthentication
>(
  state: recruiterAuthentication,
  action: PayloadAction<{ field: T }>
) => {
  return {
    ...state,
    [action.payload.field]: initialRecruiterRegisterState[action.payload.field],
  };
};
//seperate slice for recruiter to Login
const recruiterLoginSlice = createSlice({
  name: "recruiterLoginState",
  initialState: initialLoginState,
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