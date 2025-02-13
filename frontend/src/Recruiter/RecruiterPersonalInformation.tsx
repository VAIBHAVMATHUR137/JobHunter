import Navbar from "@/components/ui/navbar"
import { type ChangeEvent, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"

import type { RootState } from "../Slice/Store"
import { recruiterRegistrationUpdate } from "../Slice/RecruiterSlice"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import RecruiterRegistrationPagination from "./RecruiterRegistrationPagination" // Import updated

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

type basicFormDataType = "firstName" | "lastName" | "title" | "one_liner_intro" | "number" | "email" | "password"

const basicFormFields = ["firstName", "lastName", "title", "one_liner_intro", "number", "email", "password"] as const
type FieldName = (typeof basicFormFields)[number]

function RecruiterPersonalInformation() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [date, setDate] = useState<Date | Date[]>(new Date())
  const [showAlert, setShowAlert] = useState(false)
  const [title, setTitle] = useState<string | "">("")
  const [formComplete, setIsFormComplete] = useState(false)
  const [message, setMessage] = useState<string | " ">("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const dispatch = useDispatch()
  const formData = useSelector((state: RootState) => state.recruiterRegister)
  // Create a selector function
  const selectBasicFormData = (state: RootState) =>
    basicFormFields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: state.recruiterRegister[field],
      }),
      {} as Pick<typeof state.recruiterRegister, FieldName>,
    )
  const basicFormData = useSelector(selectBasicFormData)

  const putTitle = (heading: string) => setTitle(heading)
  const putMessage = (message: string) => setMessage(message)
  const firstName = useSelector((state: RootState) => state.recruiterRegister.firstName)
  const lastName = useSelector((state: RootState) => state.recruiterRegister.lastName)
  const username = useSelector((state: RootState) => state.recruiterRegister.username)
  const firstNameLength: number = firstName.split(" ").join("").trim().length
  const lastNameLength: number = lastName.split(" ").join("").trim().length
  const permittedUserNameLength: number = Math.trunc((firstNameLength + lastNameLength) / 2 + 3)
  const userNameLength: number = username.split(" ").join("").trim().length
  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ml_default")

        const response = await fetch("https://api.cloudinary.com/v1_1/dqjqi572q/image/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (data.secure_url) {
          setPhotoPreview(data.secure_url)
          dispatch(
            recruiterRegistrationUpdate({
              field: "photo",
              value: data.secure_url,
            }),
          )
        } else {
          console.error("Failed to get secure_url:", data)
        }
      } catch (error) {
        console.error("Error uploading photo:", error)
      }
    }
  }
  //cleanup browser memory from URL once the photo gets uploaded
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  //to get type of the field
  const getFieldType = (field: string): string => {
    switch (field) {
      case "number":
        return "number"
      case "email":
        return "email"
      case "password":
        return "password"
      default:
        return "text"
    }
  }
  //to convert string parameter from camel case to properly capitalized label with space
  const getFieldLabel = (field: string): string =>
    field
      .split(/(?=[A-Z])|_/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    dispatch(
      recruiterRegistrationUpdate({
        field: name as basicFormDataType,
        value: name === "number" ? Number(value) : value,
      }),
    )
  }


  const handleGenderChange = (value: string) => {
    dispatch(
      recruiterRegistrationUpdate({
        field: "gender",
        value,
      }),
    )
    console.log("Gender is" + value)
  }
  const handleUserNameInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    dispatch(recruiterRegistrationUpdate({ field: name as FieldName, value }))

    if (value.length === permittedUserNameLength) {
      usernameVerificationHandler(value)
    }
  }

  const usernameVerificationHandler = async (username: string) => {
    try {
      const response = await axios.post("http://localhost:5000/UserName/check", { username })

      if (response.status === 200) {
        setShowAlert(true)
        putTitle("Username Available")
        putMessage("This username can be allotted to you")
        setIsSuccess(false)
      } else {
        throw new Error("Unexpected response status")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 409) {
          setShowAlert(true)
          putTitle("Username Unavailable")
          putMessage("This username cannot be allotted to you")
          setIsSuccess(false)
        }
      }
    }
  }
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Registration</CardTitle>
            <CardDescription className="text-center">Recruiter needs to register themselves here</CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || undefined} alt="Recruiter Photo" />
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
              {basicFormFields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{getFieldLabel(field)}</Label>
                  <Input
                    id={field}
                    name={field}
                    type={getFieldType(field)}
                    value={formData[field] || ""}
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
                      <div>{`now you can enter ${permittedUserNameLength - userNameLength} characters`}</div>
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


              {/* Gender Selection */}
              <div className="space-y-2">
                <Label>Gender</Label>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={() => handleGenderChange("male")}
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={() => handleGenderChange("female")}
                  />
                  <label htmlFor="female">Female</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    id="transgender"
                    value="transgender"
                    checked={formData.gender === "transgender"}
                    onChange={() => handleGenderChange("transgender")}
                  />
                  <label htmlFor="transgender">Transgender</label>
                </div>
              </div>

              {/* Introduction */}
              <div className="space-y-2">
                <Label htmlFor="introduction">Introduction</Label>
                <Input
                  id="introduction"
                  name="introduction"
                  value={formData.introduction || ""}
                  onChange={handleInputChange}
                  placeholder="Write a brief introduction about yourself"
                  className="h-24"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              {" "}
            
              <RecruiterRegistrationPagination currentPage={1} totalPages={4} /> 
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  )
}

export default RecruiterPersonalInformation

