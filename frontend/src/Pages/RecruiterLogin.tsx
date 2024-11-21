import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../Slice/Store"
import  { ChangeEvent, FormEvent, useState, useEffect } from "react"

import {
  recruiterLoginUpdateField,
  recruiterLoginResetField,
} from "../Slice/Slice"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/ui/navbar"

// Simple array of field names
const formFields = ["email", "password"] as const
type FieldName = (typeof formFields)[number]

function RecruiterLogin() {
  const dispatch = useDispatch()
  const formData = useSelector((state: RootState) => state.recruiterLogin)
  const [formComplete, setIsFormComplete] = useState(false)

  useEffect(() => {
    const isComplete = formFields.every(
      (field) => formData[field].trim() !== ""
    )
    setIsFormComplete(isComplete)
  }, [formData])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    dispatch(recruiterLoginUpdateField({ field: name as FieldName, value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // Add your login logic here
    formFields.forEach((field) => {
      dispatch(recruiterLoginResetField({ field, value: "" }))
    })
  }

  // Helper function to get field type
  const getFieldType = (field: FieldName): string => 
    field === 'password' ? 'password' : 'email'

  // Helper function to get field label
  const getFieldLabel = (field: FieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1)

  return (
    <>
    <Navbar/>
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!formComplete}
            >
              {formComplete ? "Login" : "Complete all fields"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </>
  )
}

export default RecruiterLogin