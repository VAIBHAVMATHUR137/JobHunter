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
  recruiterUsernameAvailabilityReducer,
  recruiter_registration_reducer,
  recruiter_login_reducer,
  get_recruiter_profile
} from "./RecruiterThunk";

const store = configureStore({
  reducer: {
    candidateLogin: candidateLoginReducer,
    recruiterLogin: recruiterLoginReducer,
    candidateRegister: candidateRegistrationReducer,
    recruiterRegister: recruiterRegistrationReducer,
    jobPosting: jobPostingReducer,
    recruiterUsernameAvailability: recruiterUsernameAvailabilityReducer,
    recruiterUsernameGenerator: recruiterUsernameGeneratorReducer,
    recruiter_registration: recruiter_registration_reducer,
    recruiter_login: recruiter_login_reducer,
    recruiter_profile:get_recruiter_profile
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
