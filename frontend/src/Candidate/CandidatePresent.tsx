import { useDispatch, useSelector } from "react-redux";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
import { Input } from "@/components/ui/input";
import { candidateRegistration } from "../Slice/CandidateThunk";
import type { AppDispatch } from "@/Slice/Store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  candidateRegistrationUpdate,
  candidateRegistrationReset,
} from "../Slice/CandidateStateSlice";
import type { RootState } from "@/Slice/Store";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import CandidateRegistrationPagination from "./CandidateRegistrationPagination";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CandidatePresent() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const dispatch = useDispatch<AppDispatch>();
  const states = useSelector((state: RootState) => ({
    current_job: state.candidateRegister.current_job,
    current_location: state.candidateRegister.current_job.current_location,
  }));
  const nav = useNavigate();
  const putTitle = (title: string) => setTitle(title);
  const putMessage = (message: string) => setMessage(message);

  const candidateFormStates = useSelector(
    (state: RootState) => state.candidateRegister
  );
  interface FormField {
    id: keyof typeof formFields;
    label: string;
    type: "text";
    placeholder: string;
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
    {
      id: "company",
      label: "Enter Company Name",
      type: "text",
      placeholder: "e.g Google or Microsoft",
    },
    {
      id: "current_role",
      label: "Enter Designation",
      type: "text",
      placeholder: "e.g React Developer",
    },
    {
      id: "job_description",
      label: "Describe your work",
      type: "text",
      placeholder: "e.g Writing code for React apps",
    },
    {
      id: "date_of_commencement",
      label: "Enter date of commencement",
      type: "text",
      placeholder: "DD/MM/YYYY  OR  MM/YYYY  OR  YYYY",
    },
    {
      id: "years_of_experience",
      label: "Enter Years of Experience you have",
      type: "text",
      placeholder: "enter duration in years and in numeric form only",
    },
    {
      id: "current_location",
      label: "Current Location",
      type: "text",
      placeholder: "e.g Pune or Delhi or USA",
    },
  ];

  const handleChange = (field: keyof typeof formFields, value: string) => {
    dispatch(
      candidateRegistrationUpdate({
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
      ...candidateFormStates,
      college_education: Object.values(candidateFormStates.college_education),
      internship_experience: Object.values(
        candidateFormStates.internship_experience
      ),
      certificate_courses: Object.values(
        candidateFormStates.certificate_courses
      ),
      work_experience: Object.values(candidateFormStates.work_experience),
    };
  };
  const all_data = [
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
    "current_job",
  ] as const;
  const handleSubmit = async () => {
    const data_for_backend = formatDataForBackend();

    try {
      // Properly dispatch the thunk - it returns a Promise with a specific structure
      const resultAction = await dispatch(
        candidateRegistration(data_for_backend)
      );

      // Check if the action was fulfilled (success) or rejected (error)
      if (candidateRegistration.fulfilled.match(resultAction)) {
        // Success case
        setShowAlert(true);
        putTitle(`Welcome ${candidateFormStates.firstName}`);
        putMessage(
          `You have been registered successfully as candidate ${candidateFormStates.firstName} ${candidateFormStates.lastName}! Kindly navigate to Login Page`
        );
        setIsSuccess(true);
        all_data.forEach((entry) => {
          dispatch(candidateRegistrationReset({ field: entry }));
        });
      } else {
        // Error case
        const error = resultAction.payload;
        setShowAlert(true);
        putTitle("Error occurred");
        putMessage(
          error?.message || "Something went wrong. Please try again later."
        );
        setIsSuccess(false);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error during registration:", error);
      setShowAlert(true);
      putTitle("Error Occurred");
      putMessage("Something went wrong. Please try again later.");
      setIsSuccess(false);
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
            <CandidateRegistrationPagination
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
          nextPage={() => nav("/CandidateLogin")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}

export default CandidatePresent;