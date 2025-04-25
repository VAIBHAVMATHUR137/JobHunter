import { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRecruiterDetails, setUsername } from "@/Slice/RecruiterThunk";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RecruiterAuthContext } from "@/context/CreateContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import { useParams } from "react-router-dom";


function RecruiterProfile() {
  const { isLoading, error, recruiterData } = useSelector(
    (state: RootState) => state.recruiter_profile
  );
  const dispatch = useDispatch<AppDispatch>();

  const { username } = useParams();

  useEffect(() => {
    if (username) {
      // Set username in Redux state
      dispatch(setUsername(username));

      // Fetch the recruiter details using the username
      dispatch(fetchRecruiterDetails({ username }));
    }
  }, [username, dispatch]);

  const authContext = useContext(RecruiterAuthContext);

  // Check if context exists before destructuring
  if (!authContext) {
    throw new Error(
      "RecruiterAuthContext must be used within a RecruiterAuthProvider"
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }
  
 

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage
                  src={recruiterData?.photo}
                  alt={recruiterData?.username}
                />
                <AvatarFallback>
                  {recruiterData?.firstName?.charAt(0)}
                  {recruiterData?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">
                {recruiterData?.firstName} {recruiterData?.lastName}
              </CardTitle>
              <CardDescription className="text-lg">
                {recruiterData?.title}
              </CardDescription>
              <p className="text-sm mt-2">{recruiterData?.one_liner_intro}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{recruiterData?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{recruiterData?.number}</span>
                </div>
                {recruiterData?.current_job && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {recruiterData?.current_job.company} -{" "}
                      {recruiterData?.current_job.current_role}
                    </span>
                  </div>
                )}
                {recruiterData?.current_job?.current_location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{recruiterData?.current_job.current_location}</span>
                  </div>
                )}
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {recruiterData?.core_skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="about">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="internships">Internships</TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                    <p>{recruiterData?.introduction}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Current Position
                    </h3>
                    {recruiterData?.current_job && (
                      <div className="space-y-2">
                        <p>
                          <strong>Company:</strong>{" "}
                          {recruiterData.current_job.company}
                        </p>
                        <p>
                          <strong>Role:</strong>{" "}
                          {recruiterData.current_job.current_role}
                        </p>
                        <p>
                          <strong>Experience:</strong>{" "}
                          {recruiterData.current_job.years_of_experience}
                        </p>
                        <p>
                          <strong>Since:</strong>{" "}
                          {recruiterData.current_job.date_of_commencement}
                        </p>
                        <div>
                          <strong>Job Description:</strong>
                          <p className="mt-1">
                            {recruiterData.current_job.job_description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6">
                  {/* College Education */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Higher Education
                    </h3>
                    {recruiterData?.college_education?.map((edu, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">
                            {edu.programme_name} in {edu.specialization}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.college_name}, {edu.university_name}
                          </p>
                          <p className="text-sm">
                            {edu.year_of_commencement} -{" "}
                            {edu.year_of_conclusion} ({edu.duration})
                          </p>
                          <p className="text-sm">CGPA: {edu.cgpa}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* School Education */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 12th Standard */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          12th Standard
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>School:</strong>{" "}
                          {
                            recruiterData?.twelth_standard_education
                              ?.school_name
                          }
                        </p>
                        <p>
                          <strong>Board:</strong>{" "}
                          {
                            recruiterData?.twelth_standard_education
                              ?.school_board
                          }
                        </p>
                        <p>
                          <strong>Percentage:</strong>{" "}
                          {
                            recruiterData?.twelth_standard_education
                              ?.percentage_obtained
                          }
                        </p>
                        <p>
                          <strong>Year:</strong>{" "}
                          {
                            recruiterData?.twelth_standard_education
                              ?.year_of_passing
                          }
                        </p>
                      </CardContent>
                    </Card>

                    {/* 10th Standard */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          10th Standard
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>School:</strong>{" "}
                          {recruiterData?.tenth_standard_education?.school_name}
                        </p>
                        <p>
                          <strong>Board:</strong>{" "}
                          {
                            recruiterData?.tenth_standard_education
                              ?.school_board
                          }
                        </p>
                        <p>
                          <strong>Percentage:</strong>{" "}
                          {
                            recruiterData?.tenth_standard_education
                              ?.percentage_obtained
                          }
                        </p>
                        <p>
                          <strong>Year:</strong>{" "}
                          {
                            recruiterData?.tenth_standard_education
                              ?.year_of_passing
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </h3>
                  {recruiterData?.work_experience?.map((exp, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-4">
                        <h4 className="font-medium">{exp.designation}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}
                        </p>
                        <p className="text-sm">
                          {exp.date_of_commencement} - {exp.date_of_resignation}{" "}
                          ({exp.duration_of_service})
                        </p>
                        <p className="text-sm">CTC: {exp.annual_ctc}</p>
                        <div className="mt-2">
                          <strong>Job Description:</strong>
                          <p className="mt-1 text-sm">{exp.job_description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Certificates Tab */}
                <TabsContent value="certificates" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </h3>
                  {recruiterData?.certificate_courses?.map((cert, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-4">
                        <h4 className="font-medium">{cert.title_of_course}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.platform_name} • Mentor: {cert.mentor_name}
                        </p>
                        <p className="text-sm">
                          {cert.date_of_commencement} -{" "}
                          {cert.date_of_conclusion}
                        </p>
                        <div className="mt-2">
                          <strong>Learning:</strong>
                          <p className="mt-1 text-sm">
                            {cert.learning_description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Internships Tab */}
                <TabsContent value="internships" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Internship Experience
                  </h3>
                  {recruiterData?.internship_experience?.map(
                    (intern, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">{intern.company}</h4>
                          <p className="text-sm">
                            {intern.date_of_commencement} -{" "}
                            {intern.date_of_conclusion} ({intern.duration})
                          </p>
                          <p className="text-sm">Stipend: {intern.stipend}</p>
                          <div className="mt-2">
                            <strong>Roles & Responsibilities:</strong>
                            <p className="mt-1 text-sm">
                              {intern.roles_and_responsibilities}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default RecruiterProfile;
