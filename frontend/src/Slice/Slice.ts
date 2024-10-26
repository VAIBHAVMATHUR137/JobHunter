import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

//Common login interface declaration for both candidate and recruiter
interface loginFormState {
  email: string;
  password: string;
}

//interface for first time registration/signin by the candidate
interface candidateAuthentication {
  name: string;
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
}
//interface for first time registration/signin by the recruiter
interface recruiterAuthentication {
  name: string;
  number: string;
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
};
//initial state of recruiter during first time registration
const initialRecruiterRegisterState: recruiterAuthentication = {
  name: "",
  number: "",
  email: "",
  password: "",
  company: "",
  location: "",
};
//common reducer to update the field
const loginUpdateField =<T extends keyof loginFormState> (
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
  state[field] = value; // Type-safe assignment
};

// RESET field: Handle both string and object types correctly
const candidateRegistrationResetField = <
  T extends keyof candidateAuthentication
>(
  state: candidateAuthentication,
  action: PayloadAction<{ field: T }>
) => {
  const { field } = action.payload;

  // Reset based on the type of the field being reset
  if (typeof state[field] === "string") {
    state[field] = "" as candidateAuthentication[T];
  } else if (typeof state[field] === "object") {
    state[field] = {} as candidateAuthentication[T]; // Reset to an empty object
  }
};

//Update the recruiter registration field
const recruiterRegistrationUpdateField = (
  state: recruiterAuthentication,
  action: PayloadAction<{ field: keyof recruiterAuthentication; value: string }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};
//RESET the recruiter registration field
const recruiterRegistartionResetField = (
  state: recruiterAuthentication,
  action: PayloadAction<{ field: keyof recruiterAuthentication; value: string }>
) => {
  const { field } = action.payload;
  state[field] = "";
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
//seperate slice for recruiter to Login
const recruiterLoginSlice = createSlice({
  name: "recruiterLoginState",
  initialState: initialRecruiterLoginState,
  reducers: {
    recruiterLoginUpdateField: loginUpdateField,
    recruiterLoginResetField: loginResetField,
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
//Seperate slice for Recruiter to Register first time
const recruiterRegistrationSlice = createSlice({
  name: "recruiterRegistrationSlice",
  initialState: initialRecruiterRegisterState,
  reducers: {
    recruiterRegistrationUpdate: recruiterRegistrationUpdateField,
    recruiterRegistrationReset: recruiterRegistartionResetField,
  },
});
//Actions for candidate login fields
export const { candidateLoginUpdateField, candidateLoginResetField } =
  candidateLoginSlice.actions;
//Actions for recruiter login fields
export const { recruiterLoginUpdateField, recruiterLoginResetField } =
  recruiterLoginSlice.actions;
//Actions for candidate registration fields
export const { candidateRegistartionReset, candidateRegistartionUpdate } =
  candidateRegistrationSlice.actions;
//Actions for recruiter registration fields
export const { recruiterRegistrationReset, recruiterRegistrationUpdate } =
  recruiterRegistrationSlice.actions;

export const candidateLoginReducer = candidateLoginSlice.reducer;
export const recruiterLoginReducer = recruiterLoginSlice.reducer;
export const candidateRegistrationReducer = candidateRegistrationSlice.reducer;
export const recruiterRegistrationReducer = recruiterRegistrationSlice.reducer;
