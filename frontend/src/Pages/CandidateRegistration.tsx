import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "../Slice/Store";
import {
  candidateRegistartionUpdate,
  candidateRegistartionReset,
} from "../Slice/Slice";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import { useNavigate } from "react-router-dom";

// Existing constants from your original component
const basicFormFields = [
  "firstName",
  "lastName",
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

const skillFields = [
  "skillOne",
  "skillTwo",
  "skillThree",
  "skillFour",
  "skillFive",
] as const;

const locationFields = [
  "firstPreferrence",
  "secondPreferrence",
  "thirdPreferrence",
] as const;

type BasicFieldName = (typeof basicFormFields)[number];

export default function CandidateRegistration() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false); // Add state for alert visibility
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.candidateRegister);

  const [formComplete, setIsFormComplete] = useState(false);
  const nav = useNavigate();
  const putTitle = (heading: string) => setTitle(heading);
  const putMessage = (message: string) => setMessage(message);
  //Process to count first name, last name and username characters
  const firstName = useSelector(
    (state: RootState) => state.candidateRegister.firstName
  );
  const lastName = useSelector(
    (state: RootState) => state.candidateRegister.lastName
  );
  const username = useSelector(
    (state: RootState) => state.candidateRegister.username
  );
  const firstNameLength: number = firstName.split(" ").join("").trim().length;
  const lastNameLength: number = lastName.split(" ").join("").trim().length;
  const permittedUserNameLength: number = Math.trunc(
    (firstNameLength + lastNameLength) / 2 + 3
  );
  const userNameLength: number = username.split(" ").join("").trim().length;

  // Existing helper functions from original component
  const formatDataForBackend = () => {
    const skills = Object.values(formData.skills);
    const preferred_locations = Object.values(formData.preferred_location);

    return {
      ...formData,
      skills: skills,
      preferred_location: preferred_locations,
    };
  };

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

  const handleBasicInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      candidateRegistartionUpdate({ field: name as BasicFieldName, value })
    );
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formattedData = formatDataForBackend();
      const userNameEntry = await axios.post(
        "http://localhost:5000/UserName/create",
        { username: formData.username }
      );

      if (userNameEntry.status === 201) {
        const response = await axios.post(
          "http://localhost:5000/candidate/createCandidate",
          formattedData
        );

        if (response.status === 201) {
          setShowAlert(true);
          putTitle("Welcome Candidate");
          putMessage(
            "You have been registered successfully! Kindly navigate to Login Page"
          );
          setIsSuccess(true);
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
              field: "username",
              value: "",
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
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 409) {
          setShowAlert(true);
          putTitle("Error");
          putMessage("Candidate with same email or cell number already exists");
          setIsSuccess(false);
        } else if (status === 400) {
          setShowAlert(true);
          putTitle("Error");
          putMessage(
            "Kindly check the data you entered. There is some issue in the data you provided"
          );
          setIsSuccess(false);
        } else {
          setShowAlert(true);
          putTitle("Error Occurred");
          putMessage("Something went wrong. Please try again later.");
          setIsSuccess(false);
        }
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  };
  const handleUserNameInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    dispatch(
      candidateRegistartionUpdate({ field: name as BasicFieldName, value })
    );
    console.log("Permitted username length is " + permittedUserNameLength);
    console.log("current username length is " + userNameLength);
    if (value.length === permittedUserNameLength) {
      usernameVerificationHandler(value);
    }
  };

  const usernameVerificationHandler = async (username: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/UserName/check",
        { username }
      );

      if (response.status === 200) {
        setShowAlert(true);
        putTitle("Username Available");
        putMessage("This username can be allotted to you");
        setIsSuccess(true);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 409) {
          setShowAlert(true);
          putTitle("Username Unavailable");
          putMessage("This username cannot be allotted to you");
          setIsSuccess(false);
        }
      }
    }
  };

  const getFieldType = (field: string): string => {
    if (field.includes("email")) return "email";
    if (field.includes("password")) return "password";
    if (field.includes("username")) return "username";
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Candidate Registration
            </CardTitle>
            <CardDescription className="text-center">
              Please complete all fields to register
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={photoPreview || undefined}
                    alt="Candidate Photo"
                  />
                  <AvatarFallback>Photo</AvatarFallback>
                </Avatar>

                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Upload Photo
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </Label>
              </div>

              {/* Basic Fields */}
              {basicFormFields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label>{getFieldLabel(field)}</Label>
                  <Input
                    type={getFieldType(field)}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleBasicInputChange}
                    placeholder={getFieldLabel(field)}
                    required
                  />
                </div>
              ))}
              {/* Username field */}
              <div className="space-y-4">
                <Label className="font-bold"> Generate unique username</Label>
                <div>
                  <Label>Username</Label>
                  {!firstNameLength && !lastNameLength ? (
                    <></>
                  ) : (
                    <div>{`you are allowed username of ${permittedUserNameLength} characters`}</div>
                  )}
                  <div>
                    {!firstNameLength && !lastNameLength ? (
                      <></>
                    ) : (
                      <div>{`now you can enter ${
                        permittedUserNameLength - userNameLength
                      } characters`}</div>
                    )}
                  </div>
                  <Input
                    type="username"
                    name="username"
                    value={formData.username}
                    placeholder="Enter username"
                    onChange={handleUserNameInputChange}
                    required
                    maxLength={permittedUserNameLength}
                  />
                </div>
              </div>

              {/* Skills Fields */}
              <div className="space-y-4">
                <Label className="font-bold">Skills</Label>
                {skillFields.map((skill) => (
                  <div key={skill} className="space-y-2">
                    <Label>{getFieldLabel(skill)}</Label>
                    <Input
                      type="text"
                      name={skill}
                      value={formData.skills[skill] || ""}
                      onChange={handleSkillChange}
                      placeholder={getFieldLabel(skill)}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Preferred Location Fields */}
              <div className="space-y-4">
                <Label className="font-bold">Preferred Locations</Label>
                {locationFields.map((location) => (
                  <div key={location} className="space-y-2">
                    <Label>{getFieldLabel(location)}</Label>
                    <Input
                      type="text"
                      name={location}
                      value={formData.preferred_location[location] || ""}
                      onChange={handleLocationChange}
                      placeholder={getFieldLabel(location)}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <Label className="font-bold">Resume</Label>
                <p className="text-sm text-destructive">
                  * Kindly attach the link for resume, stored in Google Drive in
                  read-only mode
                </p>
                <Input
                  type="text"
                  name="resume"
                  value={formData.resume || ""}
                  onChange={handleBasicInputChange}
                  placeholder="Google Drive Resume Link"
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={!formComplete}>
                {formComplete ? "Register" : "Complete all fields"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      {showAlert && (
        <AlertDialogDemo
          title={title}
          message={message}
          onClose={() => setShowAlert(false)}
          nextPage={() => nav("/CandidateLogin")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}
