import { ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsername, recruiterLogin } from "@/Slice/RecruiterThunk";
import { RecruiterAuthContext } from "./CreateContext";
import { AppDispatch } from "@/Slice/Store";


interface CandidateLoginResponse {
    accessToken: string;
    refreshToken: string;
    candidate: {
      id: string;
      photo: string;
      username: string;
    };
  }
export const CandidateAuthProvider=({children}:{children:ReactNode})=>{
    const [accessToken, setAccessToken]=useState<string|null>(
      localStorage.getItem("accessToken")
    )
    const dispatch=useDispatch<AppDispatch>();
    useEffect(()=>{
      const token=localStorage.getItem("accessToken");
      if(token){
        const username=localStorage.getItem("username")
        
      }
    },[dispatch])
}
export default CandidateAuthProvider