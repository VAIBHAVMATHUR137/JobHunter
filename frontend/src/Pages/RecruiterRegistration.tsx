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
  Avatar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import {
  recruiterRegistrationReset,
  recruiterRegistrationUpdate,
} from "../Slice/Slice";
import Navbar from "../Components/Navbar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
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
function RecruiterRegistration() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.recruiterRegister);

  const [isFormComplete, setIsFormComplete] = useState(false);
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
          console.log(data.secure_url);

          dispatch(
            recruiterRegistrationUpdate({
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
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await axios.post<{ success: boolean; data: any }>(
      "http://localhost:5000/recruiter/createRecruiter",
      formData
    );  
    if (response.status === 201) {
      formFields.forEach((field) => {
        dispatch(recruiterRegistrationReset({ field, value: " " }));
      });
      setPhotoPreview(null);
    }
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
