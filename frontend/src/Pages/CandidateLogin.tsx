import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
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
  candidateLoginUpdateField,
  candidateLoginResetField,
} from "../Slice/Slice";
import Navbar from "../Components/Navbar";
import { theme, LoginButton } from "../Components/CustomTheme";

// Simple array of field names
const formFields = ["email", "password"] as const;
type FieldName = (typeof formFields)[number];

function CandidateLogin() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.candidateLogin);

  const [formComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const isComplete = formFields.every(
      (field) => formData[field].trim() !== ""
    );
    setIsFormComplete(isComplete);
  }, [formData]);
  // Function to handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(
      candidateLoginUpdateField({ field: name as "email" | "password", value })
    );
  };

  // Function to handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    formFields.forEach((field) => {
      dispatch(candidateLoginResetField({ field, value: "" }));
    });
  };

  // Render the appropriate button based on form completeness
  const RenderButton = () =>
    formComplete ? (
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    ) : (
      <LoginButton variant="contained" color="primary" fullWidth>
        Login
      </LoginButton>
    );
  // Helper function to get field type
  const getFieldType = (field: FieldName): string => field;

  // Helper function to get field label
  const getFieldLabel = (field: FieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <Card className="w-full max-w-md">
            <CardHeader
              title="Login"
              subheader="Candidate needs to login here"
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

export default CandidateLogin;
