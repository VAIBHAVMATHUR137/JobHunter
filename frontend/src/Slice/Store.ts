import { configureStore } from "@reduxjs/toolkit";
import {
  candidateLoginReducer,
  candidateRegistrationReducer,
  jobPostingReducer,
} from "./CandidateSlice";
import {
  recruiterLoginReducer,
  recruiterRegistrationReducer,
} from "./RecruiterStateSlice";
import {
  recruiterUsernameGeneratorReducer,
  get_recruiter_profile,
} from "./RecruiterThunk";

const store = configureStore({
  reducer: {
    candidateLogin: candidateLoginReducer,
    recruiterLogin: recruiterLoginReducer,
    candidateRegister: candidateRegistrationReducer,
    recruiterRegister: recruiterRegistrationReducer,
    jobPosting: jobPostingReducer,
    recruiterUsernameGenerator: recruiterUsernameGeneratorReducer,
    recruiter_profile: get_recruiter_profile,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
