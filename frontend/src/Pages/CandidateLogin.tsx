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
  resetCandidateLoginField,
  updateCandidateLoginField,
} from "../Slice/Slice";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8",
    },
  },
});

// Styled button with hover rotation effect
const RotatingButton = styled(Button)({
  backgroundColor: "#3a71a8", // Initial blue background
  color: "#fff", // Initial white text color
  transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for both properties

  "&:hover": {
    backgroundColor: "transparent", // Transparent background on hover
    color: "#000", // Black text on hover
     cursor: "default"
  },
});

function CandidateLogin() {
  const dispatch = useDispatch();
  const { email, password } = useSelector(
    (state: RootState) => state.candidateLogin
  );

  // Local state to track if the form is complete
  const [isFormComplete, setIsFormComplete] = useState(false);

  // Check form completion whenever email or password changes
  useEffect(() => {
    setIsFormComplete(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  // Function to handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(
      updateCandidateLoginField({ field: name as "email" | "password", value })
    );
  };

  // Function to handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with", { email, password });

    // Reset form fields after submission
    dispatch(resetCandidateLoginField({ field: "email", value: "" }));
    dispatch(resetCandidateLoginField({ field: "password", value: "" }));
  };

  // Render the appropriate button based on form completeness
  const renderButton = () => {
    if (isFormComplete) {
      return (
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      );
    }
    return (
      <RotatingButton variant="contained" color="primary" fullWidth>
      Login
      </RotatingButton>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader
            title="Login"
            subheader="Candidate kindly login here"
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
            <CardActions sx={{ padding: "2" }}>
              {renderButton()}
            </CardActions>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default CandidateLogin;