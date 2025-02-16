import { useDispatch, useSelector } from "react-redux"

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { recruiterRegistrationUpdate } from "../Slice/RecruiterSlice"
import type { RootState } from "@/Slice/Store"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/ui/navbar"
import RecruiterRegistrationPagination from "./RecruiterRegistrationPagination"
import axios from "axios"
import { useState } from "react"

function RecruiterPresent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch()
  const states = useSelector((state: RootState) => ({
    current_job: state.recruiterRegister.current_job,
    current_location: state.recruiterRegister.current_job.current_location,
  }))

const recruiterFormStates=useSelector((state:RootState)=>state.recruiterRegister)
  interface FormField {
    id: keyof typeof formFields
    label: string
    type: "text" | "date" 
  }

  // Define the form fields structure to match your state
  const formFields = {
    company: "company",
    current_role: "current_role",
    job_description: "job_description",
    date_of_commencement: "date_of_commencement",
    years_of_experience: "years_of_experience",
    current_location:"current_location"
  } as const

  const CURRENT_WORK: FormField[] = [
    { id: "company", label: "Enter Company Name", type: "text" },
    { id: "current_role", label: "Enter Designation", type: "text" },
    { id: "job_description", label: "Describe your work", type: "text" },
    {
      id: "date_of_commencement",
      label: "Enter date of commencement",
      type: "date",
    },
    {
      id: "years_of_experience",
      label: "Enter Years of Experience you have",
      type: "text",
    },{
      id:"current_location",
      label:"Current Location",
      type:"text"
    }
  ]

  const handleChange = (field: keyof typeof formFields, value: string) => {
  
    dispatch(
      recruiterRegistrationUpdate({
        field: "current_job",
        value: {
          ...states.current_job,
          [field]: value,
        },
      }),
    )
  }

  const getFieldValue = (id: keyof typeof formFields) => {
    return states.current_job[id] || ""
  }

const formatDataForBackend=()=>{
  return {
    ...recruiterFormStates,
    // tenth_standard_education: Object.values(recruiterFormStates.tenth_standard_education),
    // twelth_standard_education: Object.values(recruiterFormStates.twelth_standard_education),
    college_education: Object.values(recruiterFormStates.college_education),
    internship_experience: Object.values(recruiterFormStates.internship_experience),
    certificate_courses: Object.values(recruiterFormStates.certificate_courses),
    work_experience: Object.values(recruiterFormStates.work_experience),
    // current_job: Object.values(recruiterFormStates.current_job),
  }
}

const handleSubmit = async () => {
  const formattedData = formatDataForBackend();
  console.log("Sending data:", formattedData); // Log the data being sent

  try {
    const response = await axios.post("http://localhost:5000/recruiter/createRecruiter", formattedData);
    if(response.status === 201) {
      alert("Data Gone")
    }
  } catch (error: any) {
    // Better error logging
    if (axios.isAxiosError(error)) {
      console.error("Server Error Response:", error.response?.data);
      console.error("Status Code:", error.response?.status);
    }
    console.error("Error details:", error);
  }
}


  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 ">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Present Job Introduction</CardTitle>
            <CardDescription className="text-center">
              Please provide few details about your present work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-8">
              {CURRENT_WORK.map(({ id, label, type }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={label}
                    value={getFieldValue(id)}
                    onChange={(e) => handleChange(id, e.target.value)}
                  />
                </div>
              ))}
            </div>
           
          </CardContent>
          <CardFooter>
            <RecruiterRegistrationPagination currentPage={4} totalPages={4} onSubmit={handleSubmit} />
          </CardFooter>
        </Card>

      </div>
    </>
  )
}

export default RecruiterPresent

