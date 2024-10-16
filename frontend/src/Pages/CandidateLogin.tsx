import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import React, { ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,

  CardActions,
  CardHeader,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  resetCandidateLoginField,
  updateCandidateLoginField,
} from "../Slice/Slice";
//Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8",
    },
  },
});

function CandidateLogin() {
  const dispatch = useDispatch();
  const { email, password } = useSelector(
    (state: RootState) => state.candidateLogin
  );

  //function to handle input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(
      updateCandidateLoginField({ field: name as "email" | "password", value })
    );
    
  };
  //this will return true if name and value are not empty
  const isFormComplete=(event:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=event.target
    if(!name||value.trim()===''){
      return false;
    }
    return true;
  }

  //function to handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("login attempt with" + " " + { email, password });
    dispatch(resetCandidateLoginField({ field: "email", value: " " }));
    dispatch(resetCandidateLoginField({ field: "password", value: "" }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div
      className="flex justify-center items-center min-h-screen bg-gray-100 p-4"
      >
        <Card className="w-full max-w-md">
        <CardHeader
            title="Login"
            subheader="Candidate kindly login here"
            className="text-center"
          />
          <form onSubmit={handleSubmit}>
            <CardContent
              className="space-y-4"
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </CardContent>
            <CardActions sx={{padding:'2'}}>
              <Button 
             type="submit" 
             variant="contained" 
             color="primary" 
             fullWidth
             
             disabled={!isFormComplete}
           
              
              >
                Login
              </Button>
            </CardActions>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default CandidateLogin;
