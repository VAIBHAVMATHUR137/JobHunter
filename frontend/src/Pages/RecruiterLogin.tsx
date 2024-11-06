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
  recruiterLoginUpdateField,
  recruiterLoginResetField
} from "../Slice/Slice";
import Navbar from "../Components/Navbar";

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8"
    },
  },
});

// Styled button with transparent effect at hover
const LoginButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.3s ease, color 0.3s ease",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#000",
    cursor: "default",
  },
});

// Simple array of field names
const formFields = ["email", "password"] as const;
type FieldName = typeof formFields[number];

function RecruiterLogin() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.recruiterLogin);
  const [formComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const isComplete = formFields.every(field => formData[field].trim() !== "");
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(recruiterLoginUpdateField({ field: name as FieldName, value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formFields.forEach(field => {
      dispatch(recruiterLoginResetField({ field, value: "" }));
    });
  };

  const RenderButton = () => (
    formComplete ? (
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    ) : (
      <LoginButton variant="contained" color="primary" fullWidth>
        Login
      </LoginButton>
    )
  );

  // Helper function to get field type
  const getFieldType = (field: FieldName): string => field;

  // Helper function to get field label
  const getFieldLabel = (field: FieldName): string => 
    field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <>
    <Navbar/>
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

export default RecruiterLogin;