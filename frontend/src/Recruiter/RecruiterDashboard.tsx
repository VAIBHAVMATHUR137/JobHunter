import type React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RootState } from "@/Slice/Store";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";
import { recruiterRegistrationUpdate } from "@/Slice/RecruiterSlice";
import Navbar from "@/components/ui/navbar";

const RecruiterDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const recruiterData = useSelector(
    (state: RootState) => state.recruiterRegister
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recruiter/fetchRecruiter/Mathur128"
        );

        if (response.status === 200 && response.data) {
          const data = response.data;
          Object.keys(data).forEach((key) => {
            dispatch(
              recruiterRegistrationUpdate({
                field: key as keyof typeof recruiterData,
                value: data[key],
              })
            );
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching recruiter data:", error);
        setError("Failed to load recruiter data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchRecruiterData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto p-6 ">
      <header className="mb-8 flex justify-center">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
    User Profile
  </h1>
  <div>
  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">{recruiterData.username}</p>
  </div>

</header>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-primary">
                  <AvatarImage
                    src={recruiterData.photo}
                    alt={`${recruiterData.firstName} ${recruiterData.lastName}`}
                  />
                  <AvatarFallback>
                    {recruiterData.firstName[0]}
                    {recruiterData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {recruiterData.firstName} {recruiterData.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">
                    {recruiterData.title}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-primary" />{" "}
                    {recruiterData.email}
                  </p>
                  <p className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-primary" />{" "}
                    {recruiterData.number}
                  </p>
                  <p className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />{" "}
                    {recruiterData.current_job.current_location}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <Briefcase className="mr-2 h-4 w-4 text-primary" />{" "}
                    {recruiterData.current_job.company}
                  </p>
                  <p className="flex items-center text-sm">
                    <GraduationCap className="mr-2 h-4 w-4 text-primary" />{" "}
                    {recruiterData.current_job.current_role}
                  </p>
                  <p className="flex items-center text-sm">
                    <Award className="mr-2 h-4 w-4 text-primary" />{" "}
                    {recruiterData.current_job.years_of_experience} years
                    experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Core Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recruiterData.core_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="education" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Work Experience</TabsTrigger>
          </TabsList>
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Education History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recruiterData.college_education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                    >
                      <h3 className="text-lg font-semibold text-primary">
                        {edu.programme_name} in {edu.specialization}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.college_name}, {edu.university_name}
                      </p>
                      <p className="text-sm">CGPA: {edu.cgpa}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {edu.year_of_commencement} - {edu.year_of_conclusion}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recruiterData.work_experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                    >
                      <h3 className="text-lg font-semibold text-primary">
                        {exp.designation}
                      </h3>
                      <p className="text-sm font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.date_of_commencement} - {exp.date_of_resignation}
                      </p>
                      <p className="text-sm mt-2">{exp.job_description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> View Candidates
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
