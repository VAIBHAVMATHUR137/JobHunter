import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Common login interface declaration for both candidate and recruiter
interface loginFormState {
  email: string;
  password: string;
}
//non-primitive type declaration for skills
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
//interface for first time registration/signin by the candidate
interface candidateAuthentication {
  name: string;
  email: string;
  number: number;
  password: string;
  current_location: string;
  degree: string;
  skills: candidateSkills;
  college_name: string;
  college_tier: string;
  preferred_location: candidatePreferredLocation;
  notice_period: number;
  years_of_experience: number;
  github: string;
  xProfile?: string;
  linkedin: string;
  portfolio?: string;
}
//interface for first time registration/signin by the recruiter
interface recruiterAuthentication {
  name: string;
  number: number;
  email: string;
  password: string;
  company: string;
  location: string;
}
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
  email: "",
  password: "",
};
//initial state of recruiter during login
const initialRecruiterLoginState: loginFormState = {
  email: "",
  password: "",
};
//initial state of candidate during first time registration
const initialCandidateRegisterState: candidateAuthentication = {
  name: "",
  email: "",
  number: 0,
  password: "",
  current_location: "",
  degree: "",
  skills: initialSkills,
  college_name: "",
  college_tier: "",
  preferred_location: initialPreferredLocations,
  notice_period: 0,
  years_of_experience: 0,
  github: "",
  xProfile: "",
  linkedin: "",
  portfolio: "",
};
//initial state of recruiter during first time registration
const initialRecruiterRegisterState: recruiterAuthentication = {
  name: "",
  number: 0,
  email: "",
  password: "",
  company: "",
  location: "",
};
//common reducer to update the field
const updateField = (
  state: loginFormState,
  action: PayloadAction<{ field: keyof loginFormState; value: string }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};
//common reducer to reset the field
const resetField = (
  state: loginFormState,
  action: PayloadAction<{ field: keyof loginFormState; value: string }>
) => {
  const { field } = action.payload;
  state[field] = "";
};
//Seperate slice for candidate to Login
const candidateLoginSlice = createSlice({
  name: "candidateLoginSlice",
  initialState: initialCandidateLoginState,
  reducers: {
    updateCandidateLoginField: updateField,
    resetCandidateLoginField: resetField,
  },
});
//seperate slice for recruiter to Login
const recruiterLoginSlice = createSlice({
  name: "recruiterLoginState",
  initialState: initialRecruiterLoginState,
  reducers: {
    updateRecruiterLoginField: updateField,
    resetRecruiterLoginField: resetField,
  },
});
//seperate slice for candidate to Register first time
const candidateRegistrationSlice = createSlice({
  name: "candidateRegistrationSlice",
  initialState: initialCandidateRegisterState,
  reducers: {
    updateCandidateRegistrationField: updateField,
    resetCandidateRegistrationField: resetField,
  },
});
//Seperate slice for Recruiter to Register first time
const recruiterRegistrationSlice = createSlice({
  name: "recruiterRegistrationSlice",
  initialState: initialRecruiterRegisterState,
  reducers: {
    updateRecruiterRegistrationField: updateField,
    resetRecruiterRegistrationField: resetField,
  },
});
//Actions for candidate login fields
export const { updateCandidateLoginField, resetCandidateLoginField } =
  candidateLoginSlice.actions;
//Actions for recruiter login fields
export const { updateRecruiterLoginField, resetRecruiterLoginField } =
  recruiterLoginSlice.actions;
//Actions for candidate registration fields
export const {
  updateCandidateRegistrationField,
  resetCandidateRegistrationField,
} = candidateRegistrationSlice.actions;
//Actions for recruiter registration fields
export const {
  updateRecruiterRegistrationField,
  resetRecruiterRegistrationField,
} = recruiterRegistrationSlice.actions;

export const candidateLoginReducer = candidateLoginSlice.reducer;
export const recruiterLoginReducer = recruiterLoginSlice.reducer;
export const candidateRegistrationReducer = candidateRegistrationSlice.reducer;
export const recruiterRegistrationReducer = recruiterRegistrationSlice.reducer;
