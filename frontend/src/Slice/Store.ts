import {configureStore} from '@reduxjs/toolkit'
import { candidateLoginReducer,candidateRegistrationReducer,jobPostingReducer } from './CandidateSlice';
import { recruiterLoginReducer,recruiterRegistrationReducer } from "./RecruiterSlice"
const store=configureStore({
    reducer:{
        candidateLogin:candidateLoginReducer,
        recruiterLogin:recruiterLoginReducer,
        candidateRegister:candidateRegistrationReducer,
        recruiterRegister:recruiterRegistrationReducer,
        jobPosting:jobPostingReducer
        
    }   
})
export type RootState=ReturnType<typeof store.getState>
export default store;