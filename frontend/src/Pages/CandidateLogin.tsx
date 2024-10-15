import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import React, { ChangeEvent } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
//Create a custom theme
const theme=createTheme({
palette:{
  primary:{
    main:"#3a71a8"
  }
}
})



function CandidateLogin() {
  const dispatch = useDispatch();
  const {email,password}= useSelector((state: RootState) => state.candidateLogin);
  const handleInputChange=(e:ChangeEvent<HTMLInputElement>)=>{

  }
  return (
    <>
      <label>
        Email:
        <input type="email" name="email" id="email" />
      </label>
      <label>
        Password:
        <input type="password" name="password" id="password"  />
      </label>
    </>
  );
}

export default CandidateLogin;
