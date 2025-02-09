import { useDispatch, useSelector } from "react-redux"

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { recruiterRegistrationUpdate } from "../Slice/RecruiterSlice"
import type { RootState } from "@/Slice/Store"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/ui/navbar"
import RecruiterRegistrationPagination from "./RecruiterRegistrationPagination"

function RecruiterPresent() {

  const dispatch = useDispatch()
  const states = useSelector((state: RootState) => ({
    current_job: state.recruiterRegister.current_job,
    current_location: state.recruiterRegister.current_location,
  }))

  interface FormField {
    id: keyof typeof formFields
    label: string
    type: "text" | "date" | "number"
  }

  // Define the form fields structure to match your state
  const formFields = {
    company: "company",
    current_role: "current_role",
    job_description: "job_description",
    date_of_commencement: "date_of_commencement",
    years_of_experience: "years_of_experience",
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
      type: "number",
    },
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

const handleSubmit=()=>{

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

