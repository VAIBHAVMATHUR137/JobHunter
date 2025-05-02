import { configureStore } from "@reduxjs/toolkit";
import {
  candidateLoginReducer,
  candidateRegistrationReducer,
} from "./CandidateStateSlice";
import {
  recruiterLoginReducer,
  recruiterRegistrationReducer,
} from "./RecruiterStateSlice";
import {
  recruiterUsernameGeneratorReducer,
  get_recruiter_profile,
  recruiter_login_reducer,
  get_all_recruiters,
  recruiterDashboardReducer,
} from "./RecruiterThunk";
import {
  candidateUsernameGeneratorReducer,
  get_candidate_profile,
  candidate_login_reducer,
  get_all_candidates,
} from "./CandidateThunk";

const store = configureStore({
  reducer: {
    candidateLogin: candidateLoginReducer,
    recruiterLogin: recruiterLoginReducer,
    candidateRegister: candidateRegistrationReducer,
    recruiterRegister: recruiterRegistrationReducer,
    recruiterUsernameGenerator: recruiterUsernameGeneratorReducer,
    recruiter_profile: get_recruiter_profile,
    recruiterLoginThunk: recruiter_login_reducer,
    candidateUsernameGenerator: candidateUsernameGeneratorReducer,
    candidate_profile: get_candidate_profile,
    candidateLoginThunk: candidate_login_reducer,
    fetch_all_recruiters: get_all_recruiters,
    fetch_all_candidates: get_all_candidates,
    recruiterDashboard: recruiterDashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
