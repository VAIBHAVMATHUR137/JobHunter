import {configureStore} from '@reduxjs/toolkit'
import { candidateLoginReducer,recruiterLoginReducer,candidateRegistrationReducer,recruiterRegistrationReducer,jobPostingReducer } from './Slice';
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