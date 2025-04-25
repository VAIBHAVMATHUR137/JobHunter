import type React from "react";
import { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { recruiterApi } from "@/API/recruiterApi";
import {
  deleteRecruiter,
  fetchRecruiterDetails,
  recruiterLogout,
} from "@/Slice/RecruiterThunk";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RecruiterAuthContext } from "@/context/CreateContext";
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
} from "lucide-react";

import Navbar from "@/components/ui/navbar";

import type { AppDispatch } from "@/Slice/Store";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  async function getDash() {
    try {
      const response = await recruiterApi.get("/dashboard");

      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch recruiter dashboard:", error);
      throw error;
    }
  }
  getDash();

  // Updated selector to match the new state structure in RecruiterThunk.ts
  const { isLoading, error, recruiterData } = useSelector(
    (state: RootState) => state.recruiter_profile
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const storagePhoto = localStorage.getItem("recruiterPhoto");

      if (storagePhoto !== recruiterData.photo) {
        userLogout();
      }
    }, 2000);
  
    return () => clearTimeout(timeoutId);
  }, [recruiterData.photo]);
  
  const username: string = useSelector(
    (state: RootState) => state.recruiterLoginThunk.username
  );

  console.log("Full recruiter state: ", recruiterData);

  console.log(username);

  const tabMenu = ["Education", "Experience", "Certificate", "Internship"];
  const authContext = useContext(RecruiterAuthContext);

  // Check if context exists before destructuring
  if (!authContext) {
    throw new Error(
      "RecruiterAuthContext must be used within a RecruiterAuthProvider"
    );
  }

  const { logout } = authContext;

  useEffect(() => {
    const username = localStorage.getItem("recruiterUsername");
    console.log("Fetched username from localStorage: ", username);
    if (username) dispatch(fetchRecruiterDetails({ username }));
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
            <Button
              className="mt-6 w-full"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render dashboard only if recruiter data is available
  if (!recruiterData) {
    return null;
  }

  interface InternshipExperience {
    date_of_commencement: string;
    date_of_conclusion: string;
    company: string;
    duration: string;
    roles_and_responsibilities: string;
    stipend: string;
  }
  interface CertificateCourse {
    platform_name: string;
    mentor_name: string;
    title_of_course: string;
    learning_description: string;
    date_of_commencement: string;
    date_of_conclusion: string;
  }
  interface JobExperience {
    company: string;
    designation: string;
    date_of_commencement: string;
    date_of_resignation: string;
    duration_of_service: string;
    job_description: string;
    annual_ctc: string;
  }
  interface CollegeEducation {
    programme_name: string;
    specialization: string;
    college_name: string;
    university_name: string;
    cgpa: string;
    duration: string;
    year_of_commencement: string;
    year_of_conclusion: string;
  }
  const handleDelete = () => {
    dispatch(deleteRecruiter(username));
  };
  const userLogout = () => {
    dispatch(recruiterLogout(username));
    logout();
    setTimeout(() => {
      nav("/");
    }, 1500);
  };
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
          <Card className="lg:col-span-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-t-primary overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={recruiterData.photo}
                    alt={`${recruiterData.firstName} ${recruiterData.lastName}`}
                  />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {recruiterData.firstName[0]}
                    {recruiterData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-2">
                  <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {recruiterData.firstName} {recruiterData.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">
                    {recruiterData.title}
                  </CardDescription>
                  <CardDescription className="text-md text-gray-600 dark:text-gray-300 italic">
                    "{recruiterData.one_liner_intro}"
                  </CardDescription>
                </div>
              </div>
            </div>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {recruiterData.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {recruiterData.number}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {recruiterData.current_job.current_location}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {recruiterData.current_job.company}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {recruiterData.current_job.current_role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {recruiterData.current_job.years_of_experience} years
                      experience
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <Button className="m-9" onClick={handleDelete}>
              Delete Profile
            </Button>
            <div>
              <Button onClick={userLogout}>Logout</Button>
            </div>
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
                {recruiterData.core_skills.map(
                  (skill: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="Education" className="mt-8">
          <TabsList className="grid w-5/6 grid-cols-4 gap-3 mx-auto mb-6 p-1 bg-gray-100 rounded-xl shadow-sm">
            {tabMenu.map((element: string) => (
              <TabsTrigger
                key={element}
                value={element}
                className="w-full bg-blue-700 text-white rounded-full px-4 py-2 text-sm transition-all 
                 data-[state=active]:bg-gray-200 data-[state=active]:text-blue-800 
                 hover:bg-gray-300 hover:text-blue-900"
              >
                {element}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Education">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                  Education History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recruiterData.college_education
                    .map((edu: CollegeEducation, index: number) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 border-l-2 border-gray-800 last:pb-0"
                      >
                        <h3 className="text-lg font-semibold text-gray-950">
                          {edu.programme_name} in {edu.specialization}
                        </h3>
                        <p className="text-base font-medium text-blue-950 mt-1">
                          {edu.college_name}
                          <br />
                          University: {edu.university_name}
                        </p>
                        <p className="text-sm mt-1 text-black font-medium">
                          CGPA: {edu.cgpa}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {edu.year_of_commencement} - {edu.year_of_conclusion}
                        </p>
                      </div>
                    ))
                    .reverse()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Experience">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Briefcase className="mr-2 h-6 w-6 text-primary" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 ">
                  {recruiterData.work_experience
                    .map((exp: JobExperience, index: number) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 border-l-2 border-gray-800 last:pb-0"
                      >
                        {/* Content */}
                        <h3 className="text-lg font-semibold text-gray-950">
                          {exp.designation}
                        </h3>
                        <p className="text-base font-medium text-blue-950 mt-1">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-950 mt-1">
                          {exp.date_of_commencement} - {exp.date_of_resignation}
                        </p>
                        <p className="text-sm mt-2 text-blue-950 leading-relaxed">
                          {exp.job_description}
                        </p>
                      </div>
                    ))
                    .reverse()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Certificate">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Briefcase className="mr-2 h-6 w-6 text-primary" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 ">
                  {recruiterData.certificate_courses
                    .map((certificate: CertificateCourse, index: number) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 border-l-2 border-gray-800 last:pb-0"
                      >
                        {/* Content */}
                        <h3 className="text-lg font-semibold text-gray-950">
                          {certificate.platform_name}
                        </h3>
                        <h3 className="text-lg font-semibold text-gray-950">
                          {certificate.title_of_course}
                        </h3>
                        <p className="text-base font-medium text-blue-950 mt-1">
                          Mentor: {certificate.mentor_name}
                        </p>
                        <p className="text-sm text-gray-950 mt-1">
                          {certificate.date_of_commencement} -{" "}
                          {certificate.date_of_conclusion}
                        </p>
                        <p className="text-sm mt-2 text-blue-950 leading-relaxed">
                          {certificate.learning_description}
                        </p>
                      </div>
                    ))
                    .reverse()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Internship">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Briefcase className="mr-2 h-6 w-6 text-primary" />
                  Previous Internships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 ">
                  {recruiterData.internship_experience
                    .map((internship: InternshipExperience, index: number) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 border-l-2 border-gray-800 last:pb-0"
                      >
                        {/* Content */}
                        <h3 className="text-lg font-semibold text-gray-950">
                          {internship.company}
                        </h3>
                        <p className="text-base font-medium text-blue-950 mt-1">
                          {internship.roles_and_responsibilities}
                        </p>
                        <p className="text-sm text-gray-950 mt-1">
                          {internship.date_of_commencement} -{" "}
                          {internship.date_of_conclusion}
                        </p>
                        <p className="text-sm mt-2 text-blue-950 leading-relaxed">
                          Duration : {internship.duration} months
                        </p>
                      </div>
                    ))
                    .reverse()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
