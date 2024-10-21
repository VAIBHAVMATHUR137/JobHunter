import { useSelector, useDispatch } from "react-redux";
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


//Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8"
    },
  },
});
//Styled button with transparent effect at hover
const LoginButton = styled(Button)({
  backgroundColor: theme.palette.primary.main, // Initial blue background
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
  //Function to handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      updateRecruiterLoginField({ field: name as "email" | "password", value })
    );
  };
  //Function to handle form submission by recruiter
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(resetRecruiterLoginField({ field: "email", value: "" }));
    dispatch(resetRecruiterLoginField({ field: "password", value: "" }));
  };
  //Function to display the style of button depending upon completion of form
  function RenderButton() {
    if (formComplete) {
      return (
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      );
    } else {
      return (
        <LoginButton variant="contained" color="primary" fullWidth>
          Login
        </LoginButton>
      );
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader
            title="Login"
            subheader="Recruiter needs to login here"
            className="text-center"
          />
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            <CardActions sx={{ padding: "2" }}>{RenderButton()}</CardActions>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}
export default RecruiterLogin;
