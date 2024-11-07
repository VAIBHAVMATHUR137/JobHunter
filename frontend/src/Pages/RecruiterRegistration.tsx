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
import { ThemeProvider } from "@mui/material/styles";

import {
  recruiterRegistrationReset,
  recruiterRegistrationUpdate,
} from "../Slice/Slice";
import Navbar from "../Components/Navbar";
import { RegistrationButton, theme } from "../Components/CustomTheme";
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
  const formData = useSelector((state: RootState) => state.recruiterRegister);

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
  const RenderButton = () =>
    isFormComplete ? (
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>
    ) : (
      <RegistrationButton variant="contained" color="primary" fullWidth>
        Register
      </RegistrationButton>
    );
  //Helper function to get field type
  const getFieldType = (field: fieldName): string => field;
  //Function to get field label
  const getFieldLabel = (field: fieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <Card className="w-full max-w-md">
            <CardHeader
              title="Registration"
              subheader="Recruiter needs to register themselves here"
              className="text-center"
            />
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {formFields.map((field) => (
                  <TextField
                    key={field}
                    fullWidth
                    label={getFieldLabel(field)}
                    name={field}
                    type={getFieldType(field)}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                ))}
              </CardContent>
              <CardActions sx={{ padding: "2" }}>
                <RenderButton />
              </CardActions>
            </form>
          </Card>
        </div>
      </ThemeProvider>
    </>
  );
}

export default RecruiterRegistration;
