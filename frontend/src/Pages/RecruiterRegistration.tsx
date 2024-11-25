import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { RootState } from "../Slice/Store";
import {
  recruiterRegistrationReset,
  recruiterRegistrationUpdate,
} from "../Slice/Slice";
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
  "name",
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
    const isComplete = formFields.every(
      (field) => formData[field].trim() !== ""
    );
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(recruiterRegistrationUpdate({ field: name as FieldName, value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
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
        setPhotoPreview(null);
      }
    } catch (error) {
      setShowAlert(true);
      putTitle("Error Occured");
      putMessage(`${error}`);
      setIsSuccess(false);
    }
  };

  const getFieldType = (field: FieldName): string => {
    if (field === "email") return "email";
    if (field === "password") return "password";
    if (field === "number") return "tel";
    return "text";
  };

  const getFieldLabel = (field: FieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1);

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
