import {configureStore} from '@reduxjs/toolkit'
import { candidateLoginReducer,recruiterLoginReducer } from './Slice';
const store=configureStore({
    reducer:{
        candidateLogin:candidateLoginReducer,
        recruiterLogin:recruiterLoginReducer
    }   
})
export type RootState=ReturnType<typeof store.getState>
export default store;