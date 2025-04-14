import { configureStore } from "@reduxjs/toolkit";
import {
  candidateLoginReducer,
  candidateRegistrationReducer,
} from "./CandidateSlice";
import {
  recruiterLoginReducer,
  recruiterRegistrationReducer,
} from "./RecruiterStateSlice";
import {
  recruiterUsernameGeneratorReducer,
  get_recruiter_profile,
  recruiter_login_reducer,
} from "./RecruiterThunk";

const store = configureStore({
  reducer: {
    candidateLogin: candidateLoginReducer,
    recruiterLogin: recruiterLoginReducer,
    candidateRegister: candidateRegistrationReducer,
    recruiterRegister: recruiterRegistrationReducer,
    recruiterUsernameGenerator: recruiterUsernameGeneratorReducer,
    recruiter_profile: get_recruiter_profile,
    recruiterLoginThunk: recruiter_login_reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
