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
  Avatar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import {
  candidateRegistartionUpdate,
  candidateRegistartionReset,
} from "../Slice/Slice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Navbar from "../Components/Navbar";
import { theme, RegistrationButton } from "../Components/CustomTheme";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.candidateRegister);
  const [formComplete, setIsFormComplete] = useState(false);

  // Function to format data for backend
  const formatDataForBackend = () => {
    const skills = Object.values(formData.skills);
    const preferred_locations = Object.values(formData.preferred_location);

    return {
      ...formData,
      skills: skills, // Convert skills object to array
      preferred_location: preferred_locations, // Convert preferred_location object to array
    };
  };

  // Function to handle the photo upload
  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dqjqi572q/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setPhotoPreview(data.secure_url);

          dispatch(
            candidateRegistartionUpdate({
              field: "photo",
              value: data.secure_url,
            })
          );
        } else {
          console.error("Failed to get secure_url:", data);
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  useEffect(() => {
    const isBasicFieldsComplete = basicFormFields.every(
      (field) => formData[field]?.toString().trim() !== ""
    );
    const isSkillsComplete = Object.values(formData.skills).every(
      (skill) => skill.trim() !== ""
    );
    const isLocationsComplete = Object.values(
      formData.preferred_location
    ).every((location) => location.trim() !== "");

    setIsFormComplete(
      isBasicFieldsComplete && isSkillsComplete && isLocationsComplete
    );
  }, [formData]);

  // Function to handle basic input change
  const handleBasicInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      candidateRegistartionUpdate({ field: name as BasicFieldName, value })
    );
  };

  // Function to handle skills change
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

  // Function to handle location change
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

  // Function that handles post submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formattedData = formatDataForBackend();
      const response = await axios.post<{ success: boolean; data: any }>(
        "http://localhost:5000/candidate/createCandidate",
        formattedData
      );
      if (response.status === 201) {
        // Reset form after successful submission
        basicFormFields.forEach((field) => {
          dispatch(candidateRegistartionReset({ field, value: "" }));
        });
        const emptySkills = {
          skillOne: "",
          skillTwo: "",
          skillThree: "",
          skillFour: "",
          skillFive: "",
        };
        dispatch(
          candidateRegistartionReset({
            field: "skills",
            value: emptySkills,
          })
        );

        // Reset location fields
        const emptyLocations = {
          firstPreferrence: "",
          secondPreferrence: "",
          thirdPreferrence: "",
        };
        dispatch(
          candidateRegistartionReset({
            field: "preferred_location",
            value: emptyLocations,
          })
        );
        dispatch(
          candidateRegistartionReset({
            field: "resume",
            value: "",
          })
        );
        setPhotoPreview(null);
      } else {
        console.log("data not success");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          `Registration failed: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const RenderButton = () =>
    formComplete ? (
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>
    ) : (
      <RegistrationButton
        variant="contained"
        color="primary"
        fullWidth
        disabled
      >
        Complete all fields
      </RegistrationButton>
    );

  const getFieldType = (field: string): string => {
    if (field.includes("email")) return "email";
    if (field.includes("password")) return "password";
    if (
      field.includes("number") ||
      field.includes("period") ||
      field.includes("experience")
    )
      return "number";
    return "text";
  };

  const getFieldLabel = (field: string): string =>
    field
      .split(/(?=[A-Z])|_/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <>
      <Navbar />
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
                {/* Photo Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar
                    src={photoPreview || undefined}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Photo
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
                </div>

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
                <div className="space-y-4">
                  <div className="font-medium">Resume</div>
                  <div className="text-[#b91c1c]">
                    * Kindly attach the link for resume, stored in Google Drive
                    in read-only mode
                  </div>
                  <TextField
                    fullWidth
                    label="Resume"
                    name="resume"
                    type="text"
                    value={formData.resume}
                    onChange={handleBasicInputChange}
                    required
                    variant="outlined"
                  />
                </div>
              </CardContent>
              <CardActions sx={{ padding: 2 }}>
                <RenderButton />
              </CardActions>
            </form>
          </Card>
        </div>
      </ThemeProvider>
    </>
  );
}

export default CandidateRegistration;
