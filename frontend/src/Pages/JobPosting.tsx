import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Slice/Store";
import { jobPostingUpdate, jobPostingReset } from "@/Slice/CandidateSlice";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
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
import { recruiterApi } from "@/API/recruiterApi";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/ui/navbar";

const basicFormFields = [
  "job_role",
  "CTC",
  "experience_required",
  "years_of_experience_required",
  "degree_required",
  "bond",
  "job_location",
  "company",
] as const;
// const skillFormFields = ["skills_required"] as const;
type basicFieldName = (typeof basicFormFields)[number];
// type skillFieldName = (typeof skillFormFields)[number];

function JobPosting() {
  const recruiter = useSelector(
    (state: RootState) => state.recruiterApi.username
  );

  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const [formComplete, setIsFormComplete] = useState(false);
  const dispatch = useDispatch();
  const jobData = useSelector((state: RootState) => state.jobPosting);
  const nav = useNavigate();
  const putTitle = (heading: string) => setTitle(heading);
  const putMessage = (message: string) => setMessage(message);
  const accessToken = localStorage.getItem("accessToken");
  const recruiterEmail = localStorage.getItem("recruiterEmail");
  useEffect(() => {
    if (!accessToken) {
      setShowAlert(true);
      putTitle("Authentication Required");
      putMessage("Please login as a recruiter to post jobs");
      setTimeout(() => nav("/RecruiterLogin"), 1500);
    }
  }, [accessToken, nav]);
  const formatSkillsForBackend = () => {
    const skills = Object.values(jobData.skills_required).filter(
      (skill) => skill.trim() !== ""
    ); // Remove empty skills

    return {
      ...jobData,
      skills_required: skills,
    };
  };

  //this is to check if none of the entries at the jobposting form is empty
  useEffect(() => {
    const isBasicFormComplete = basicFormFields.every(
      (field) => jobData[field]?.toString().trim() !== " "
    );
    const isSkillsComplete = Object.values(jobData.skills_required).every(
      (skill) => skill.trim() !== ""
    );
    setIsFormComplete(isBasicFormComplete && isSkillsComplete);
  }, [jobData]);

  const handleBasicInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(jobPostingUpdate({ field: name as basicFieldName, value }));
  };
  const handleSkillChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedSkills = {
      ...jobData.skills_required,
      [name]: value,
    };
    dispatch(
      jobPostingUpdate({ field: "skills_required", value: updatedSkills })
    );
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowAlert(true);
        putTitle("Authentication Error");
        putMessage("Please login again to post jobs");
        return;
      }
      const formattedData = {
        ...formatSkillsForBackend(),
        recruiter_email: recruiterEmail,
      };
      const response = await recruiterApi.post("/job/create", formattedData);
      console.log(response);
      if (response.status === 201) {
        setShowAlert(true);
        putTitle("Job has been posted");
        putMessage("Job has been stored in the backend");
        setIsSuccess(true);
        basicFormFields.forEach((field) => {
          dispatch(jobPostingReset({ field, value: " " }));
        });
        const emptySkills = {
          skillRequiredOne: " ",
          skillRequiredTwo: "",
          skillRequiredThree: "",
          skillRequiredFour: "",
          skillRequiredFive: "",
        };
        dispatch(
          jobPostingReset({ field: "skills_required", value: emptySkills })
        );
      } else {
        console.log("Data not success");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          setShowAlert(true);
          putTitle("Unauthorized access");
          putMessage("Only recruiter can post a job");
        }
      } else {
        console.error("Non-Axios error:", error);
      }
      console.log(error);
    }
  };
  const getFieldType = (field: string): string => {
    if (field === "years_of_experience_required" || field === "CTC") {
      return "number";
    } else if (field === "experience_required") {
      return "boolean";
    }
    return "string";
  };
  const getFieldLabel = (field: string): string =>
    field
      .split(/(?=[A-Z])|_/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <>
      <Navbar />
      {recruiter && (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Post a Job</CardTitle>
              <CardDescription className="text-center">
                Fill in the details you need from the candidate
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <div>
                <CardContent className="space-y-4">
                  {basicFormFields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label>{getFieldLabel(field)}</Label>
                      <Input
                        type={getFieldType(field)}
                        name={field}
                        value={jobData[field] || " "}
                        onChange={handleBasicInputChange}
                        required
                      />
                    </div>
                  ))}
                </CardContent>
              </div>
              <div>
                <CardContent className="space-y-4">
                  {Object.keys(jobData.skills_required).map((skill) => (
                    <div key={skill} className="space-y-2">
                      <Label>{getFieldLabel(skill)}</Label>
                      <Input
                        type="text"
                        name={skill}
                        value={
                          jobData.skills_required[
                            skill as keyof typeof jobData.skills_required
                          ] || ""
                        }
                        onChange={handleSkillChange}
                        required
                      />
                    </div>
                  ))}
                </CardContent>
              </div>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!formComplete}
                >
                  {formComplete ? "Register" : "Complete all fields"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {showAlert && (
        <AlertDialogDemo
          title={title}
          message={message}
          onClose={() => setShowAlert(false)}
          nextPage={() => nav("/")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}
export default JobPosting;
