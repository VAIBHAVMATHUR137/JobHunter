import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../Slice/Store";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  recruiterLoginUpdateField,
  recruiterLoginResetField,
} from "../Slice/RecruiterStateSlice";
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
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "@/context/Context";

const formFields = ["username", "password"] as const;
type FieldName = (typeof formFields)[number];

function RecruiterLogin() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [formComplete, setIsFormComplete] = useState(false);
  const nav = useNavigate();

  const formData = useSelector((state: RootState) => state.recruiterLogin);
  const dispatch = useDispatch<AppDispatch>();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("RecruiterLogin must be used within an AuthProvider");
  }

  useEffect(() => {
    const isComplete = formFields.every(
      (field) => formData[field].trim() !== ""
    );
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(recruiterLoginUpdateField({ field: name as FieldName, value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await auth.recruiterLoginHandler(
        formData.username, 
        formData.password
      );
      
      if (response.status === 200) {
        setShowAlert(true);
        setTitle("Welcome Recruiter");
        setMessage("Successfully logged in");
        setIsSuccess(true);

        // Reset form fields
        formFields.forEach((field) => {
          dispatch(recruiterLoginResetField({ field, value: "" }));
        });

        // Navigate to dashboard with username
        setTimeout(() => 
          nav(`/RecruiterDashboard/${response.data.recruiter.username}`), 
          1500
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorTitle = "Error";
        let errorMessage = "Something went wrong";

        switch (status) {
          case 400:
            errorMessage = "Invalid data entered";
            break;
          case 404:
            errorMessage = "Recruiter credentials not found";
            break;
          case 401:
            errorMessage = "Incorrect Password";
            break;
          default:
            errorMessage = error.response?.data?.message || "Login failed";
        }

        setShowAlert(true);
        setTitle(errorTitle);
        setMessage(errorMessage);
        setIsSuccess(false);
      } else {
        console.error("Non-Axios error:", error);
        setShowAlert(true);
        setTitle("Error");
        setMessage("An unexpected error occurred");
        setIsSuccess(false);
      }
    }
  };

  const getFieldType = (field: FieldName): string =>
    field === "password" ? "password" : "text";

  const getFieldLabel = (field: FieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Recruiter Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={!formComplete}>
                {formComplete ? "Login" : "Complete all fields"}
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
          nextPage={() => nav("/dashboard")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}

export default RecruiterLogin;