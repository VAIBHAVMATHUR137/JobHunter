import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "@/Slice/Store";
import { recruiterRegistrationUpdate } from "@/Slice/Slice";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
export default function RecruiterDashboard() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();
  const recruiterDetails = useSelector(
    (state: RootState) => state.recruiterRegister
  );
  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const storedUsername = localStorage.getItem("username");

        // If URL username doesn't match stored username, redirect
        if (storedUsername && urlUsername !== storedUsername) {
          navigate(`/RecruiterDashboard/${storedUsername}`, { replace: true });
          return;
        }

        // If no URL username, redirect using stored username
        if (!urlUsername && storedUsername) {
          navigate(`/RecruiterDashboard/${storedUsername}`, { replace: true });
          return;
        }

        if (urlUsername) {
          const response = await axios.get(
            `http://localhost:5000/recruiter/fetchRecruiter/${urlUsername}`
          );
          if (response.data) {
            dispatch(
              recruiterRegistrationUpdate({
                field: "photo",
                value: response.data.photo,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "firstName",
                value: response.data.firstName,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "lastName",
                value: response.data.lastName,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "number",
                value: response.data.number,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "email",
                value: response.data.email,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "company",
                value: response.data.company,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "location",
                value: response.data.location,
              })
            );
            dispatch(
              recruiterRegistrationUpdate({
                field: "username",
                value: response.data.username,
              })
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecruiter();
  }, [dispatch, urlUsername, navigate]);
  const deleteRecruiterProfile = async () => {
    if (urlUsername) {
      const response = await axios.delete(
        `http://localhost:5000/recruiter/deleteRecruiter/${urlUsername}`
      );
      if (response.status === 200) {
        setShowAlert(true);
        setTitle("Deleted");
        setMessage("The recruiter has been deleted");
        setIsSuccess(false);
        setTimeout(() => {
          navigate("/");
        }, 1500);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        localStorage.removeItem("jobRole");

        localStorage.removeItem("photo");
        localStorage.removeItem("username");
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage
                  src={recruiterDetails.photo}
                  alt={recruiterDetails.firstName}
                />
                <AvatarFallback>
                  {recruiterDetails.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">
                {recruiterDetails.firstName}
              </h2>
              <p className="text-muted-foreground">{`@${recruiterDetails.username}`}</p>
              <Button className="m-4" onClick={deleteRecruiterProfile}>
                Delete Account
              </Button>
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
                  {recruiterDetails.firstName} {recruiterDetails.lastName}
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
      {showAlert && (
        <AlertDialogDemo
          title={title}
          message={message}
          onClose={() => setShowAlert(false)}
          nextPage={() => navigate("/")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
}
