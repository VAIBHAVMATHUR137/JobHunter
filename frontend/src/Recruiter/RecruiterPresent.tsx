import { useDispatch, useSelector } from "react-redux";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  recruiterRegistrationUpdate,
  recruiterRegistrationReset,
} from "../Slice/RecruiterSlice";
import type { RootState } from "@/Slice/Store";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import RecruiterRegistrationPagination from "./RecruiterRegistrationPagination";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecruiterPresent() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const dispatch = useDispatch();
  const states = useSelector((state: RootState) => ({
    current_job: state.recruiterRegister.current_job,
    current_location: state.recruiterRegister.current_job.current_location,
  }));
  const nav = useNavigate();
  const putTitle = (title: string) => setTitle(title);
  const putMessage = (message: string) => setMessage(message);
  const recruiterFormStates = useSelector(
    (state: RootState) => state.recruiterRegister
  );
  interface FormField {
    id: keyof typeof formFields;
    label: string;
    type: "text" ,
    placeholder:string
  }
  // Define the form fields structure to match your state
  const formFields = {
    company: "company",
    current_role: "current_role",
    job_description: "job_description",
    date_of_commencement: "date_of_commencement",
    years_of_experience: "years_of_experience",
    current_location: "current_location",
  } as const;
  const CURRENT_WORK: FormField[] = [
    { id: "company", label: "Enter Company Name", type: "text" ,placeholder:"e.g Google or Microsoft" },
    { id: "current_role", label: "Enter Designation", type: "text", placeholder:"e.g React Developer" },
    { id: "job_description", label: "Describe your work", type: "text", placeholder:"e.g Writing code for React apps" },
    {
      id: "date_of_commencement",
      label: "Enter date of commencement",
      type:"text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"
    },
    {
      id: "years_of_experience",
      label: "Enter Years of Experience you have",
      type: "text",
         placeholder:"enter duration in years and in numeric form only"
    },
    {
      id: "current_location",
      label: "Current Location",
      type: "text",
         placeholder:"e.g Pune or Delhi or USA"
    },
  ];

  const handleChange = (field: keyof typeof formFields, value: string) => {
    dispatch(
      recruiterRegistrationUpdate({
        field: "current_job",
        value: {
          ...states.current_job,
          [field]: value,
        },
      })
    );
  };

  const getFieldValue = (id: keyof typeof formFields) => {
    return states.current_job[id] || "";
  };

  const formatDataForBackend = () => {
    return {
      ...recruiterFormStates,
      college_education: Object.values(recruiterFormStates.college_education),
      internship_experience: Object.values(
        recruiterFormStates.internship_experience
      ),
      certificate_courses: Object.values(
        recruiterFormStates.certificate_courses
      ),
      work_experience: Object.values(recruiterFormStates.work_experience),
    };
  };
  const all_data=[
    "firstName",
    "lastName",
    "title",
    "one_liner_intro",
    "email",
    "password",
    "username",
    "gender",
    "introduction",
    "number",
    "tenth_standard_education",
    "twelth_standard_education",
    "college_education",
    "core_skills",
    "internship_experience",
    "certificate_courses",
    "work_experience",
    "current_job"
  ] as const 
  const handleSubmit = async () => {
    const data_for_backend = formatDataForBackend();

    try {
      const username_entry = await axios.post(
        "http://localhost:5000/UserName/create",
        {
          username: recruiterFormStates.username,
        }
      );
      if (username_entry.status === 201) {
        const response = await axios.post(
          "http://localhost:5000/recruiter/createRecruiter",
          data_for_backend
        );
        if (response.status === 201) {
          setShowAlert(true);
          putTitle(`Welcome ${recruiterFormStates.firstName}`);
          putMessage(
            `You have been registered successfully as recruiter ${recruiterFormStates.firstName} ${recruiterFormStates.lastName} ! Kindly navigate to Login Page`
          );
          setIsSuccess(true);
          all_data.forEach((entry)=>{
            dispatch(recruiterRegistrationReset({field:entry}))
          })
        }
      } else {
        setShowAlert(true);
        putTitle("Error occured");
        putMessage("Some unexpected error occured");
        setIsSuccess(false);
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
          console.error("Server Error Response:", error.response?.data);
          console.error("Status Code:", error.response?.status);
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

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 ">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Present Job Introduction
            </CardTitle>
            <CardDescription className="text-center">
              Please provide few details about your present work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-8">
              {CURRENT_WORK.map(({ id, label, type, placeholder }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={getFieldValue(id)}
                    onChange={(e) => handleChange(id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <RecruiterRegistrationPagination
              currentPage={4}
              totalPages={4}
              onSubmit={handleSubmit}
            />
          </CardFooter>
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

export default RecruiterPresent;