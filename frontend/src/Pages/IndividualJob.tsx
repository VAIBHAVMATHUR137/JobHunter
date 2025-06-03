import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchIndividualJob } from "@/Slice/JobThunk";
import type { AppDispatch, RootState } from "@/Slice/Store";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { deleteJobPostingThunk } from "@/Slice/JobThunk";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import {
  Building,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  GraduationCap,
  Code,
  Languages,
  Globe,
  FileText,
  Gift,
  AtSign,
  Calendar,
  CheckCircle2,
  XCircle,
  BookmarkPlus,
  Share2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { candidateDashboard } from "@/Slice/CandidateThunk";
import {
  createApplicationThunk,
  screenApplicationThunk,
} from "@/Slice/JobApplicationThunk";
import { useState } from "react";

export default function IndividualJobPage() {
  const [isPosted, setIsPosted] = useState<boolean | null>(null);
  const [isApplied, setIsApplied] = useState<boolean | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [showDialog, setShowDialog] = useState(false);

  const { jobID } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const job = useSelector((state: RootState) => state.individual_job.jobData);
  console.log(job);

  const candidateUsername = localStorage.getItem("candidateUsername");
  const recruiterUsername = localStorage.getItem("recruiterUsername");

  const candidateProfile = useSelector(
    (state: RootState) => state.candidateDashboard.candidateData
  );

  const loading = useSelector(
    (state: RootState) => state.individual_job.isLoading
  );
  const error = useSelector((state: RootState) => state.individual_job.error);
  useEffect(() => {
    const buttonRender = async () => {
      if (candidateUsername && jobID) {
        try {
          await dispatch(
            screenApplicationThunk({ candidateUsername, jobID })
          ).unwrap();

          // If success, candidate has NOT applied yet
          setIsApplied(false);
        } catch (error: any) {
          // If it throws error like 403, candidate HAS already applied
          if (error?.status === 403) {
            setIsApplied(true);
          } else {
            console.error("Unexpected error while checking application", error);
            setIsApplied(null); // fallback to disabled loading button
          }
        }
      }
      if (recruiterUsername && jobID) {
        try {
          await dispatch(
            screenApplicationThunk({ recruiterUsername, jobID })
          ).unwrap();

          // Recruiter has posted the job
          setIsPosted(true);
        } catch (error: any) {
          // Recruiter has NOT posted the job (likely 403 or similar)
          if (error?.status === 403) {
            setIsPosted(false);
          } else {
            console.error("Unexpected error for recruiter screening", error);
            setIsPosted(null); // fallback
          }
        }
      }
    };
    buttonRender();
  }, []);

  useEffect(() => {
    if (jobID) {
      dispatch(fetchIndividualJob({ jobID }));
    }

    if (candidateUsername) {
      dispatch(candidateDashboard({ username: candidateUsername }));
    }
  }, [dispatch, jobID]);

  // Format experience from months to years and months
  const formatExperience = (months: string) => {
    if (!months) return "Not specified";
    const numMonths = Number.parseInt(months);
    const years = Math.floor(numMonths / 12);
    const remainingMonths = numMonths % 12;

    if (years === 0)
      return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  };

  // Format CTC range
  const formatCTC = (ctc: { minCTC: string; maxCTC: string }) => {
    if (!ctc.minCTC && !ctc.maxCTC) return "Not specified";
    if (ctc.minCTC && ctc.maxCTC) return `${ctc.minCTC} - ${ctc.maxCTC}`;
    return ctc.minCTC || ctc.maxCTC;
  };

  const appliedForJob = async () => {
    const recruiterUsername = job.username;

    if (!candidateUsername || !jobID) {
      setShowAlert(true);
      setIsSuccess(false);
      setTitle("Unauthorised Application !");
      setMessage("User needs to login as candidate before applying");
    } else {
      try {
        const screeningResponse = await dispatch(
          screenApplicationThunk({ candidateUsername, jobID })
        ).unwrap();
        console.log(screeningResponse);
        if (screeningResponse.result.status === 200) {
          console.log("Recruiter screening successful ");
          const application = await dispatch(
            createApplicationThunk({
              recruiterUsername,
              candidateProfile,
              job,
            })
          ).unwrap();

          if (application.success) {
            setShowAlert(true);
            setIsSuccess(true);
            setTitle("Success");
            setMessage("Applied for this job successfully");
          } else {
            setShowAlert(true);
            setIsSuccess(false);
            setTitle("Oops!");
            setMessage("Some issue at the backend. Please try later");
          }
        } else {
          setShowAlert(true);
          setIsSuccess(false);
          setTitle("Oops!");
          setMessage("Some issue at the backend. Please try later");
        }
      } catch (err: any) {
        // 403 error (already applied)
        if (err?.status === 403) {
          setShowAlert(true);
          setIsSuccess(false);
          setTitle("Unauthorised Application !");
          setMessage("Cannot apply for the same job again");
        } else {
          setShowAlert(true);
          setIsSuccess(false);
          setTitle("Error !");
          setMessage("Unexpected error at the backend");
          console.log(err);
        }
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading job details...</p>
        </div>
      </>
    );
  }

  const deleteJob = (jobID: string) => {
    setTitle("Delete Job");
    setMessage(
      "Are you sure you want to delete this job? This action cannot be undone."
    );
    setConfirmAction(() => async () => {
      const response = await dispatch(
        deleteJobPostingThunk({ jobID })
      ).unwrap();
      if (response.success) {
        setShowAlert(true);
        setIsSuccess(false);
        setTitle("Deleted !");
        setMessage("Job Deleted Successfully.Navigating back to dashboard....");
        setTimeout(() => {
          navigate("/RecruiterDashboard");
        }, 2500);
      }
    });
    setShowDialog(true);
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="inline-flex h-12 w-12 rounded-full bg-red-100 text-red-500 items-center justify-center mb-4">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Unable to load job details
            </h3>
            <p className="text-red-600">{error}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() =>
                  dispatch(fetchIndividualJob({ jobID: jobID || "" }))
                }
              >
                Try Again
              </Button>
              <Button onClick={() => navigate("/AllJobs")}>Back to Jobs</Button>
            </div>
          </div>
        </div>
      </>
    );
  }
  console.log("State here is " + isPosted);
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Job header */}
          <Card className="mb-6 border border-gray-200 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {job.designation}
                  </h1>
                  <div className="flex items-center text-base text-gray-700 mb-4">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{job.company_name}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>
                      {job.job_location.join(", ") || "Location not specified"}
                    </span>
                  </div>

                  {/* Recruiter Badge - Sober Style */}
                  <div className="flex items-center mb-4">
                    <div
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md px-3 py-2 cursor-pointer"
                      onClick={() => navigate(`/Recruiter/${job.username}`)}
                    >
                      <AtSign className="h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Recruiter</span>
                        <span className="font-medium text-gray-800">
                          {job.username}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200"
                    >
                      {job.work_environment}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200"
                    >
                      <Briefcase className="h-3.5 w-3.5 mr-1" />
                      {job.type_of_employment}
                    </Badge>

                    {job.isFresherEligible && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Fresher Eligible
                      </Badge>
                    )}

                    {job.isVisaSponsored && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <Globe className="h-3.5 w-3.5 mr-1" />
                        Visa Sponsored
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium text-gray-700">
                          {formatExperience(job.experience_required_in_months)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Salary</p>
                        <p className="text-sm font-medium text-gray-700">
                          {formatCTC(job.CTC)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Job Type</p>
                        <p className="text-sm font-medium text-gray-700">
                          {job.type_of_employment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {!recruiterUsername && !candidateUsername ? (
                    <Button disabled>Login for further action</Button>
                  ) : recruiterUsername ? (
                    isPosted === true ? (
                      <>
                        <Button
                          onClick={() =>
                            navigate(
                              `/RecruiterDashboard/MyRecruitments/${jobID}`
                            )
                          }
                        >
                          View Applicants
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full md:w-auto"
                          onClick={() => {
                            deleteJob(job.jobID);
                          }}
                        >
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                          Delete Job
                        </Button>
                      </>
                    ) : isPosted === false ? (
                      <Button disabled>View Applicants</Button>
                    ) : (
                      <Button disabled>Loading...</Button>
                    )
                  ) : candidateUsername ? (
                    isApplied === false ? (
                      <Button onClick={appliedForJob}>Apply Now</Button>
                    ) : isApplied === true ? (
                      <Button disabled>Apply now</Button>
                    ) : (
                      <Button disabled>Loading...</Button>
                    )
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Left column - Main job details */}
            <div className="md:col-span-2 space-y-6">
              {/* Job description */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Job Description
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    {job.job_description ? (
                      <p className="text-base leading-relaxed">
                        {job.job_description}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        No job description provided
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Required Skills */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-600" />
                    Required Skills
                  </h2>
                  {job.skills_required && job.skills_required.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No specific skills mentioned
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Required Languages */}
              {job.required_languages && job.required_languages.length > 0 && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Languages className="mr-2 h-5 w-5 text-blue-600" />
                      Required Languages
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.required_languages.map((language, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Perks and Benefits */}
              {job.perks_and_benefits && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Gift className="mr-2 h-5 w-5 text-blue-600" />
                      Perks and Benefits
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                      <p className="text-base leading-relaxed">
                        {job.perks_and_benefits}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column - Additional requirements */}
            <div className="space-y-6">
              {/* Company and Recruiter Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="mr-2 h-5 w-5 text-blue-600" />
                    About the Company
                  </h2>
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-lg font-semibold">
                        {job.company_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {job.company_name}
                      </h3>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      >
                        View company profile
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="mr-2 h-4 w-4 text-blue-600" />
                    Recruiter
                  </h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      <AtSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {job.username}
                      </p>
                      <p className="text-xs text-gray-500">Hiring Manager</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => navigate(`/Recruiter/${job.username}`)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Job Requirements Summary */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                    Job Requirements
                  </h2>

                  <div className="space-y-4">
                    {/* Education */}
                    {job.degree_required && job.degree_required.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Education
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                          <div className="space-y-2">
                            {job.degree_required.map((degree, index) => (
                              <div key={index} className="flex items-start">
                                <GraduationCap className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                <span className="text-gray-800">{degree}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bond if applicable */}
                    {job.bond && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Bond Requirement
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                            <span className="text-gray-800">{job.bond}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fresher Eligibility */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Fresher Eligible
                      </h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <div className="flex items-center">
                          {job.isFresherEligible ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              <span className="text-gray-800">
                                Yes - Freshers can apply
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 mr-2 text-red-500" />
                              <span className="text-gray-800">
                                No - Experience required
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Visa Sponsorship */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Visa Sponsorship
                      </h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <div className="flex items-center">
                          {job.isVisaSponsored ? (
                            <>
                              <Globe className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="text-gray-800">Available</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 mr-2 text-red-500" />
                              <span className="text-gray-800">
                                Not Available
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Now Card */}
              <Card className="border border-gray-200 shadow-sm bg-blue-50">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Ready to Apply?
                  </h2>
                  <p className="text-gray-700 mb-4 text-sm">
                    Submit your application now and take the next step in your
                    career journey.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                    Apply for this Position
                  </Button>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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

        <ConfirmationDialog
          title={title}
          message={message}
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onConfirm={confirmAction}
        />
      </div>
    </>
  );
}
