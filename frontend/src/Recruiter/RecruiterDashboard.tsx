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
  const recruiterData = useSelector((state: RootState) => state.recruiterRegister);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recruiter/fetchRecruiter/Putin1234"
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Profile Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 ">
              @{recruiterData.username}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-24 w-24 border-4 border-primary ring-4 ring-primary/20">
                  <AvatarImage
                    src={recruiterData.photo}
                    alt={`${recruiterData.firstName} ${recruiterData.lastName}`}
                  />
                  <AvatarFallback className="text-lg">
                    {recruiterData.firstName[0]}
                    {recruiterData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-2">
                  <CardTitle className="text-3xl">
                    {recruiterData.firstName} {recruiterData.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">
                    {recruiterData.title}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{recruiterData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{recruiterData.number}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{recruiterData.current_job.current_location}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{recruiterData.current_job.company}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{recruiterData.current_job.current_role}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{recruiterData.current_job.years_of_experience} years experience</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                Core Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recruiterData.core_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1 text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="education" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-primary/5 rounded-lg">
            <TabsTrigger 
              value="education"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              Education
            </TabsTrigger>
            <TabsTrigger 
              value="experience"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              Work Experience
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="education">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                  Education History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recruiterData.college_education.map((edu, index) => (
                    <div
                      key={index}
                      className="relative pl-6 pb-8 border-l-2 border-primary/20 last:pb-0"
                    >
                      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary" />
                      <h3 className="text-lg font-semibold text-primary">
                        {edu.programme_name} in {edu.specialization}
                      </h3>
                      <p className="text-base font-medium mt-1">
                        {edu.college_name}
                        <br />
                        University: {edu.university_name}
                      </p>
                      <p className="text-sm mt-1">CGPA: {edu.cgpa}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {edu.year_of_commencement} - {edu.year_of_conclusion}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Briefcase className="mr-2 h-6 w-6 text-primary" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recruiterData.work_experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 pb-8 border-l-2 border-primary/20 last:pb-0"
                    >
                      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary" />
                      <h3 className="text-lg font-semibold text-primary">
                        {exp.designation}
                      </h3>
                      <p className="text-base font-medium mt-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {exp.date_of_commencement} - {exp.date_of_resignation}
                      </p>
                      <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                        {exp.job_description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 flex justify-end">
          <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <Users className="h-5 w-5" />
            <span>View Candidates</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;