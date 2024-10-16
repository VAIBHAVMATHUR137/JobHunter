import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import React, { ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,

  CardActions,

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Card sx={{ width: "100%", maxWidth: "24rem" }}>
          <form onSubmit={handleSubmit}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
              variant="outlined"
              color="primary"
              fullWidth
              disabled={!isFormComplete}
              >
                Login
              </Button>
            </CardActions>
          </form>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default CandidateLogin;
