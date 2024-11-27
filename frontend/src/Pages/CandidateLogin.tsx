import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  candidateLoginUpdateField,
  candidateLoginResetField,
} from "../Slice/Slice";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
import Navbar from "../components/ui/navbar";
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
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import axios from "axios";
// Simple array of field names
const formFields = ["email", "password"] as const;
type FieldName = (typeof formFields)[number];

function CandidateLogin() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const nav = useNavigate();
  const putTitle = (heading: string) => setTitle(heading);
  const putMessage = (message: string) => setMessage(message);
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
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/candidate/login",
        formData
      );
      if (response.status === 200) {
        console.log(response.data);
        setShowAlert(true);
        putTitle("Welcome again Candidate");
        putMessage("You have successfully logged in ");
        setIsSuccess(false);
        formFields.forEach((field) => {
          dispatch(candidateLoginResetField({ field, value: "" }));
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          setShowAlert(true);
          putTitle("Error");
          putMessage(
            "Kindly check the data you entered. There is some issue in the data you provided"
          );
          setIsSuccess(false);
        } else if (status === 404) {
          setShowAlert(true);
          putTitle("Error");
          putMessage("Recruiter with such credentials do not exists");
          setIsSuccess(false);
        } else if (status === 401) {
          setShowAlert(true);
          putTitle("Error");
          putMessage("Incorrect Password");
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

  // Helper function to get field type
  const getFieldType = (field: FieldName): string =>
    field === "password" ? "password" : "email";

  // Helper function to get field label
  const getFieldLabel = (field: FieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Recruiter needs to login here
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
          nextPage={() => nav("/CandidateLogin")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}

export default CandidateLogin;
