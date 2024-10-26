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
  recruiterRegistrationReset,
  recruiterRegistrationUpdate,
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
const RegistrationButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.3s ease, color 0.3 ease",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#000",
    cursor: "default",
  },
});
const formFields = [
  "name",
  "number",
  "email",
  "password",
  "company",
  "location",
] as const;
type fieldName = (typeof formFields)[number];
function RecruiterRegistration() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.recruiterLogin);

  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const isComplete = formFields.every(
      (field) => formData[field].trim() !== ""
    );
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(recruiterRegistrationUpdate({ field: name as fieldName, value }));
  };

  //function to handle registration form submission by recruiter
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formFields.forEach((field) => {
      dispatch(recruiterRegistrationReset({ field, value: " " }));
    });
  };
  function RenderButton() {
    isFormComplete ? (
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>
    ) : (
      <RegistrationButton variant="contained" color="primary" fullWidth>
        Register
      </RegistrationButton>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4"></div>
    </ThemeProvider>
  );
}

export default RecruiterRegistration;
