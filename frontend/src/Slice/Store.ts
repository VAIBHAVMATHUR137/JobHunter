import {configureStore} from '@reduxjs/toolkit'
import { candidateLoginReducer,recruiterLoginReducer,candidateRegistrationReducer,recruiterRegistrationReducer } from './Slice';
const store=configureStore({
    reducer:{
        candidateLogin:candidateLoginReducer,
        recruiterLogin:recruiterLoginReducer,
        candidateRegister:candidateRegistrationReducer,
        recruiterRegister:recruiterRegistrationReducer
        
    }   
})
export type RootState=ReturnType<typeof store.getState>
export default store;