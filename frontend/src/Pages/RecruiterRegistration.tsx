import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import {
  recruiterRegistrationReset, recruiterRegistrationUpdate
} from "../Slice/Slice";

//Create custom theme in material UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8",
    },
  },
});
//Button with hover styling conditionally
const registrationButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.3s ease, color 0.3 ease",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#000",
    cursor: "default",
  },
});
function RecruiterRegistration() {
  const dispatch=useDispatch();
  const{name,number,email,password,company,location}=useSelector((state:RootState)=>state.recruiterRegister)
  const[isFormComplete,setIsFormComplete]=useState(false);
  useEffect(()=>{
    setIsFormComplete(name.trim()!==""&&!number&&email.trim()!==""&&password.trim()!==""&&company.trim()!==""&&location.trim()!=="")
  },[name,number,email,password,company,location])
  const handleInputChange=(event:ChangeEvent<HTMLInputElement>)=>{
    const{name,value}=event.target;
    dispatch(recruiterRegistrationUpdate({
      field:name as "name"|"number"|"email"|"password"|"company"|"location",value
    }))
  }
  return <div></div>;
}

export default RecruiterRegistration;
