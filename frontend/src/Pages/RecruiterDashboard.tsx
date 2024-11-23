import Navbar from "@/components/ui/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, MapPin, Phone, User } from 'lucide-react'
import { useEffect, } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { RootState } from "@/Slice/Store"
import { recruiterRegistrationUpdate } from "@/Slice/Slice"



export default function RecruiterDashboard() {
  const dispatch=useDispatch();
  const recruiterDetails=useSelector((state:RootState)=>state.recruiterRegister)
useEffect(()=>{
  const fetchRecruiter=async ()=>{
    try {
      const response=await axios.get("http://localhost:5000/recruiter/fetchRecruiter/6740864d7859a5483cd7b93c");
      if(response.data){
        dispatch(recruiterRegistrationUpdate({
          field:"photo",
          value:response.data.photo
        }))
        dispatch(recruiterRegistrationUpdate({
          field:"name",
          value:response.data.name
        }))
        dispatch(recruiterRegistrationUpdate({
          field:"number",
          value:response.data.number}
        ))
        dispatch(recruiterRegistrationUpdate({
          field:"email",
          value:response.data.email
        }))
        dispatch(
          recruiterRegistrationUpdate({
            field:"company",
            value:response.data.company
          })
        )
        dispatch(recruiterRegistrationUpdate({
          field:"location",
          value:response.data.location
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }
  fetchRecruiter();
},[dispatch])

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={recruiterDetails.photo} alt={recruiterDetails.name} />
              <AvatarFallback>{recruiterDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{recruiterDetails.name}</h2>
            <p className="text-muted-foreground">{recruiterDetails.company}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                <span className="font-medium mr-2">Name:</span>
                {recruiterDetails.name}
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <span className="font-medium mr-2">Email:</span>
                {recruiterDetails.email}
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                <span className="font-medium mr-2">Phone:</span>
                {recruiterDetails.number}
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                <span className="font-medium mr-2">Location:</span>
                {recruiterDetails.location}
              </li>
              <li className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                <span className="font-medium mr-2">Company:</span>
                {recruiterDetails.company}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}

