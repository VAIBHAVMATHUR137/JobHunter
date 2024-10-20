import { UseSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
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
  resetRecruiterLoginField,
  updateRecruiterLoginField,
} from "../Slice/Slice";
import { useSelector } from "react-redux";

//Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#00000068",
    },
  },
});
//Styled button with transparent effect at hover
const LoginButton = styled(Button)({
  backgroundColor: "#3a71a8", // Initial blue background
  color: "#fff", // Initial white text color
  transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for both properties

  "&:hover": {
    backgroundColor: "transparent", // Transparent background on hover
    color: "#000", // Black text on hover
    cursor: "default",
  },
});

function RecruiterLogin() {
  const dispatch = useDispatch();
  const { email, password } = useSelector(
    (state: RootState) => state.recruiterLogin
  );
  const [formComplete, setIsFormComplete] = useState(false);
  useEffect(() => {
    setIsFormComplete(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const handleInputChange=(event:ChangeEvent<HTMLInputElement>)=>{
    const{name,value}=event.target;
    
  }
  return <div></div>;
}

export default RecruiterLogin;
