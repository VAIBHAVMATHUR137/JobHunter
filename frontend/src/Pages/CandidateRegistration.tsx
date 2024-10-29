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
  candidateRegistartionUpdate,
  candidateRegistartionReset,
} from "../Slice/Slice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8",
    },
  },
});

const RegistrationButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.3s ease, color 0.3s ease",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#000",
    cursor: "default",
  },
});



// Basic form fields excluding nested objects
const basicFormFields = [
  "name",
  "email",
  "number",
  "password",
  "current_location",
  "degree",
  "college_name",
  "college_tier",
  "notice_period",
  "years_of_experience",
  "github",
  "xProfile",
  "linkedin",
  "portfolio",
] as const;

// Skills fields
const skillFields = [
  "skillOne",
  "skillTwo",
  "skillThree",
  "skillFour",
  "skillFive",
] as const;

// Preferred location fields
const locationFields = [
  "firstPreferrence",
  "secondPreferrence",
  "thirdPreferrence",
] as const;

type BasicFieldName = (typeof basicFormFields)[number];

function CandidateRegistration() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.candidateRegister);
  const [formComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const isBasicFieldsComplete = basicFormFields.every(
      (field) => formData[field]?.toString().trim() !== ""
    );
    const isSkillsComplete = Object.values(formData.skills).every(
      (skill) => skill.trim() !== ""
    );
    const isLocationsComplete = Object.values(formData.preferred_location).every(
      (location) => location.trim() !== ""
    );

    setIsFormComplete(isBasicFieldsComplete && isSkillsComplete && isLocationsComplete);
  }, [formData]);

  const handleBasicInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(candidateRegistartionUpdate({ field: name as BasicFieldName, value }));
  };

  const handleSkillChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedSkills = {
      ...formData.skills,
      [name]: value,
    };
    dispatch(
      candidateRegistartionUpdate({
        field: "skills",
        value: updatedSkills,
      })
    );
  };

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedLocations = {
      ...formData.preferred_location,
      [name]: value,
    };
    dispatch(
      candidateRegistartionUpdate({
        field: "preferred_location",
        value: updatedLocations,
      })
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    basicFormFields.forEach((field) => {
      dispatch(candidateRegistartionReset({ field, value: " " }));
    });
  };

  const RenderButton = () =>
    formComplete ? (
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    ) : (
      <RegistrationButton variant="contained" color="primary" fullWidth>
        Login
      </RegistrationButton>
    );

  const getFieldType = (field: string): string => {
    if (field.includes("email")) return "email";
    if (field.includes("password")) return "password";
    if (field.includes("number") || field.includes("period") || field.includes("experience"))
      return "number";
    return "text";
  };

  const getFieldLabel = (field: string): string =>
    field
      .split(/(?=[A-Z])|_/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader
            title="Registration"
            subheader="Candidate Registration Form"
            className="text-center"
          />
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Basic Fields */}
              {basicFormFields.map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={getFieldLabel(field)}
                  name={field}
                  type={getFieldType(field)}
                  value={formData[field]}
                  onChange={handleBasicInputChange}
                  required
                  variant="outlined"
                />
              ))}

              {/* Skills Fields */}
              <div className="space-y-4">
                <div className="font-medium">Skills</div>
                {skillFields.map((skill) => (
                  <TextField
                    key={skill}
                    fullWidth
                    label={getFieldLabel(skill)}
                    name={skill}
                    type="text"
                    value={formData.skills[skill]}
                    onChange={handleSkillChange}
                    required
                    variant="outlined"
                  />
                ))}
              </div>

              {/* Preferred Location Fields */}
              <div className="space-y-4">
                <div className="font-medium">Preferred Locations</div>
                {locationFields.map((location) => (
                  <TextField
                    key={location}
                    fullWidth
                    label={getFieldLabel(location)}
                    name={location}
                    type="text"
                    value={formData.preferred_location[location]}
                    onChange={handleLocationChange}
                    required
                    variant="outlined"
                  />
                ))}
              </div>
            </CardContent>
            <CardActions sx={{ padding: 2 }}>
              <RenderButton />
            </CardActions>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default CandidateRegistration;