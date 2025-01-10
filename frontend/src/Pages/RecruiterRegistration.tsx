import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { RootState } from "../Slice/Store";
import {
  recruiterRegistrationReset,
  recruiterRegistrationUpdate,
} from "../Slice/RecruiterSlice";
import { useNavigate } from "react-router-dom";
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
const formFields = [
  "firstName",
  "lastName",
  "number",
  "email",
  "password",
  "company",
  "location",
] as const;

import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
type FieldName = (typeof formFields)[number];

function RecruiterRegistration() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Add state for alert visibility
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.recruiterRegister);

  const [isFormComplete, setIsFormComplete] = useState(false);
  const nav = useNavigate();
  const putTitle = (heading: string) => setTitle(heading);
  const putMessage = (message: string) => setMessage(message);
  //Process to count first name, last name and username characters
  const firstName = useSelector(
    (state: RootState) => state.recruiterRegister.firstName
  );
  const lastName = useSelector(
    (state: RootState) => state.recruiterRegister.lastName
  );
  const username = useSelector(
    (state: RootState) => state.recruiterRegister.username
  );
  const firstNameLength: number = firstName.split(" ").join("").trim().length;
  const lastNameLength: number = lastName.split(" ").join("").trim().length;
  const permittedUserNameLength: number = Math.trunc(
    (firstNameLength + lastNameLength) / 2 + 3
  );
  const userNameLength: number = username.split(" ").join("").trim().length;

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
    const isComplete = formFields.every((field) => {
      const value = formData[field];
      return typeof value === "string" && value.trim() !== "";
    });
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(recruiterRegistrationUpdate({ field: name as FieldName, value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const userNameEntry = await axios.post(
        "http://localhost:5000/UserName/create",
        { username: formData.username }
      );
      if (userNameEntry.status === 201) {
        const response = await axios.post(
          "http://localhost:5000/recruiter/createRecruiter",
          formData
        );
        
        if (response.status === 201) {
          setShowAlert(true);
          putTitle("Welcome Recruiter");
          putMessage(
            "You have been registered successfully! Kindly navigate to Login Page"
          );
          setIsSuccess(true);
          formFields.forEach((field) => {
            dispatch(recruiterRegistrationReset({ field, value: "" }));
          });
          dispatch(recruiterRegistrationReset({field:"username",value:""}))
          setPhotoPreview(null);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 409) {
          setShowAlert(true);
          putTitle("Error");
          putMessage("Recruiter with same email or cell number already exists");
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
    dispatch(recruiterRegistrationUpdate({ field: name as FieldName, value }));

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
        setIsSuccess(false);
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
  const getFieldType = (field: FieldName): string => {
    if (field === "email") return "email";
    if (field === "password") return "password";
    if (field === "number") return "tel";

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
            <CardTitle className="text-center">Registration</CardTitle>
            <CardDescription className="text-center">
              Recruiter needs to register themselves here
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={photoPreview || undefined}
                    alt="Recruiter Photo"
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

              {/* Form Fields */}
              {formFields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{getFieldLabel(field)}</Label>
                  <Input
                    id={field}
                    type={getFieldType(field)}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${getFieldLabel(field)}`}
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
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormComplete}
              >
                {isFormComplete ? "Register" : "Complete all fields"}
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
          nextPage={() => nav("/RecruiterLogin")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}

export default RecruiterRegistration;
