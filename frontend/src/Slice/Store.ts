import { configureStore } from '@reduxjs/toolkit'
import { candidateLoginReducer, candidateRegistrationReducer, jobPostingReducer } from './CandidateSlice';
import { recruiterLoginReducer, recruiterRegistrationReducer } from "./RecruiterStateSlice";
import recruiterApiReducer from "./RecruiterThunk"

const store = configureStore({
    reducer: {
        candidateLogin: candidateLoginReducer,
        recruiterLogin: recruiterLoginReducer,
        candidateRegister: candidateRegistrationReducer,
        recruiterRegister: recruiterRegistrationReducer,
        recruiterApi: recruiterApiReducer,
        jobPosting: jobPostingReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;