import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for School Education
interface SchoolEducation {
  school_name: string;
  percentage_obtained: string;
  year_of_passing: string;
  school_board: string;
}
const initialSchoolEducation: SchoolEducation = {
  school_name: "",
  percentage_obtained: "",
  year_of_passing: "",
  school_board: "",
};
//Male or female
type Gender = "male" | "female" | "transgender";
const initialGender: Gender = "male";
//Common login interface declaration for both candidate and candidate
interface loginFormState {
  username: string;
  password: string;
}
const initialLoginState: loginFormState = {
  username: "",
  password: "",
};
//College Education
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

const initialCollegeEducation: CollegeEducation = {
  programme_name: "",
  specialization: "",
  college_name: "",
  university_name: "",
  cgpa: "",
  duration: "",
  year_of_commencement: "",
  year_of_conclusion: "",
};

//Internship Experience
interface InternshipExperience {
  date_of_commencement: string;
  date_of_conclusion: string;
  company: string;
  duration: string;
  roles_and_responsibilities: string;
  stipend: string;
}

const initialInternship: InternshipExperience = {
  date_of_commencement: "",
  date_of_conclusion: "",
  company: "",
  duration: "",
  roles_and_responsibilities: "",
  stipend: "",
};

//Job Experience
interface JobExperience {
  company: string;
  designation: string;
  date_of_commencement: string;
  date_of_resignation: string;
  duration_of_service: string;
  job_description: string;
  annual_ctc: string;
}
const initial_job_experience: JobExperience = {
  company: "",
  designation: "",
  date_of_commencement: "",
  date_of_resignation: "",
  duration_of_service: "",
  job_description: "",
  annual_ctc: "",
};
//Certificate
interface CertificateCourse {
  platform_name: string;
  mentor_name: string;
  title_of_course: string;
  learning_description: string;
  date_of_commencement: string;
  date_of_conclusion: string;
}
const initialCertificateState: CertificateCourse = {
  platform_name: "",
  mentor_name: "",
  title_of_course: "",
  learning_description: "",
  date_of_commencement: "",
  date_of_conclusion: "",
};
//Current Job
interface CurrentJob {
  company: string;
  job_description: string;
  date_of_commencement: string;
  current_role: string;
  years_of_experience: string;
  current_location: string;
}
const initialCurrentJob: CurrentJob = {
  company: "",
  job_description: "",
  date_of_commencement: "",
  current_role: "",
  years_of_experience: "",
  current_location: "",
};

//interface for first time registration/signin by the candidate
interface candidateAuthentication {
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
  photo: string;
  tenth_standard_education: SchoolEducation;
  twelth_standard_education: SchoolEducation;
  college_education: CollegeEducation[];
  internship_experience: InternshipExperience[];
  work_experience: JobExperience[];
  core_skills: string[];
  certificate_courses: CertificateCourse[];
  current_job: CurrentJob;
}
const initialCandidateRegisterState: candidateAuthentication = {
  firstName: "",
  lastName: "",
  title: "",
  one_liner_intro: "",
  number: "",
  email: "",
  username: "",
  password: "",
  gender: initialGender,
  introduction: "",
  photo: "",
  tenth_standard_education: initialSchoolEducation,
  twelth_standard_education: initialSchoolEducation,
  college_education: [initialCollegeEducation],
  internship_experience: [initialInternship],
  work_experience: [initial_job_experience],
  core_skills: [],
  certificate_courses: [initialCertificateState],
  current_job: initialCurrentJob,
};

//common reducer to update the field
const loginUpdateField = <T extends keyof loginFormState>(
  state: loginFormState,
  action: PayloadAction<{ field: T; value: loginFormState[T] }>
) => {
  const { field, value } = action.payload;
  return {
    ...state,
    [field]: value,
  };
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
//Update the candidate registration field
const candidateRegistrationUpdateField = <
  T extends keyof candidateAuthentication
>(
  state: candidateAuthentication,
  action: PayloadAction<{ field: T; value: candidateAuthentication[T] }>
) => {
  const { field, value } = action.payload;
  return {
    ...state,
    [field]: value,
  };
};
//RESET the candidate registration field
const candidateRegistartionResetField = <
  T extends keyof candidateAuthentication
>(
  state: candidateAuthentication,
  action: PayloadAction<{ field: T }>
) => {
  return {
    ...state,
    [action.payload.field]: initialCandidateRegisterState[action.payload.field],
  };
};
//seperate slice for candidate to Login
const candidateLoginSlice = createSlice({
  name: "candidateLoginState",
  initialState: initialLoginState,
  reducers: {
    candidateLoginUpdateField: loginUpdateField,
    candidateLoginResetField: loginResetField,
  },
});
//Seperate slice for Candidate to Register first time
const candidateRegistrationSlice = createSlice({
  name: "candidateRegistrationSlice",
  initialState: initialCandidateRegisterState,
  reducers: {
    candidateRegistrationUpdate: candidateRegistrationUpdateField,
    candidateRegistrationReset: candidateRegistartionResetField,
  },
});

//Actions for candidate login fields
export const { candidateLoginUpdateField, candidateLoginResetField } =
  candidateLoginSlice.actions;
//Actions for candidate registration fields
export const { candidateRegistrationReset, candidateRegistrationUpdate } =
  candidateRegistrationSlice.actions;
export const candidateLoginReducer = candidateLoginSlice.reducer;
export const candidateRegistrationReducer = candidateRegistrationSlice.reducer;

