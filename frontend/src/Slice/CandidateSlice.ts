import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//non-primitive type declaration for skills achieved by the candidate
type candidateSkills = {
  skillOne: string;
  skillTwo: string;
  skillThree: string;
  skillFour: string;
  skillFive: string;
};

//non-primitive type declaration for preferred location of job by candidate
type candidatePreferredLocation = {
  firstPreferrence: string;
  secondPreferrence: string;
  thirdPreferrence: string;
};

//non-primitive type declaration for preferred skills required for a job
type skillsRequired = {
  skillRequiredOne: string;
  skillRequiredTwo: string;
  skillRequiredThree: string;
  skillRequiredFour: string;
  skillRequiredFive: string;
};

//Common login interface declaration for both candidate and recruiter
interface loginFormState {
  username: string;
  password: string;
}

//interface for first time registration/signin by the candidate
interface candidateAuthentication {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  password: string;
  current_location: string;
  degree: string;
  skills: candidateSkills;
  college_name: string;
  college_tier: string;
  preferred_location: candidatePreferredLocation;
  notice_period: string;
  years_of_experience: string;
  github: string;
  xProfile?: string;
  linkedin: string;
  portfolio?: string;
  photo: string;
  resume: string;
  username: string;
}

//interface for the job posting form
interface jobPosting {
  job_role: string;
  CTC: number;
  experience_required: string;
  years_of_experience_required: number;
  degree_required: string;
  bond: string;
  job_location: string;
  company: string;
  skills_required: skillsRequired;
  recruiterId: string;
  recruiter_email: string;
}
const initialSkillsForJob: skillsRequired = {
  skillRequiredOne: "",
  skillRequiredTwo: "",
  skillRequiredThree: "",
  skillRequiredFour: "",
  skillRequiredFive: "",
};
const initialJobPosting: jobPosting = {
  job_role: "",
  CTC: 0,
  experience_required: "",
  years_of_experience_required: 0,
  degree_required: "",
  bond: "",
  job_location: "",
  company: "",
  skills_required: initialSkillsForJob,
  recruiterId: "",
  recruiter_email: "",
};
//initial skills of candidate
const initialSkills: candidateSkills = {
  skillOne: "",
  skillTwo: "",
  skillThree: "",
  skillFour: "",
  skillFive: "",
};
//initial preferred location by the candidate
const initialPreferredLocations: candidatePreferredLocation = {
  firstPreferrence: "",
  secondPreferrence: "",
  thirdPreferrence: "",
};
//initial state of candidate during login
const initialCandidateLoginState: loginFormState = {
  username: "",
  password: "",
};

//initial state of candidate during first time registration
const initialCandidateRegisterState: candidateAuthentication = {
  firstName: "",
  lastName: "",
  email: "",
  number: "",
  password: "",
  current_location: "",
  degree: "",
  skills: initialSkills,
  college_name: "",
  college_tier: "",
  preferred_location: initialPreferredLocations,
  notice_period: "",
  years_of_experience: "",
  github: "",
  xProfile: "",
  linkedin: "",
  portfolio: "",
  photo: "",
  resume: "",
  username: "",
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

//Update the candidate registration field
const candidateRegistrationUpdateField = <
  T extends keyof candidateAuthentication
>(
  state: candidateAuthentication,
  action: PayloadAction<{ field: T; value: candidateAuthentication[T] }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};

// RESET field: Handle both string and object types correctly
const candidateRegistrationResetField = <
  T extends keyof candidateAuthentication
>(
  state: candidateAuthentication,
  action: PayloadAction<{ field: T; value: candidateAuthentication[T] }>
) => {
 
    state[action.payload.field]=initialCandidateRegisterState[action.payload.field]
};

//Common reducer to update the job posting field
const jobPostingUpdateField = <T extends keyof jobPosting>(
  state: jobPosting,
  action: PayloadAction<{ field: T; value: jobPosting[T] }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};

//Common reducer to reset the job posting field
const jobPostingResetField = <T extends keyof jobPosting>(
  state: jobPosting,
  action: PayloadAction<{ field: T; value: jobPosting[T] }>
) => {
state[action.payload.field]=initialJobPosting[action.payload.field]
};
//Seperate slice for candidate to Login
const candidateLoginSlice = createSlice({
  name: "candidateLoginSlice",
  initialState: initialCandidateLoginState,
  reducers: {
    candidateLoginUpdateField: loginUpdateField,
    candidateLoginResetField: loginResetField,
  },
});

//seperate slice for candidate to Register first time
const candidateRegistrationSlice = createSlice({
  name: "candidateRegistrationSlice",
  initialState: initialCandidateRegisterState,
  reducers: {
    candidateRegistartionUpdate: candidateRegistrationUpdateField,
    candidateRegistartionReset: candidateRegistrationResetField,
  },
});

//Slice for posting a job by the recruiter
const jobpostingSlice = createSlice({
  name: "jobPostingSlice",
  initialState: initialJobPosting,
  reducers: {
    jobPostingUpdate: jobPostingUpdateField,
    jobPostingReset: jobPostingResetField,
  },
});
//Actions for candidate login fields
export const { candidateLoginUpdateField, candidateLoginResetField } =
  candidateLoginSlice.actions;

//Actions for candidate registration fields
export const { candidateRegistartionReset, candidateRegistartionUpdate } =
  candidateRegistrationSlice.actions;

//Actions for job posting field
export const { jobPostingUpdate, jobPostingReset } = jobpostingSlice.actions;
export const candidateLoginReducer = candidateLoginSlice.reducer;

export const candidateRegistrationReducer = candidateRegistrationSlice.reducer;

export const jobPostingReducer = jobpostingSlice.reducer;
