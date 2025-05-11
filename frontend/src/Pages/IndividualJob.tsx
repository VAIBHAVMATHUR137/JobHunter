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
  Star,
  FileText,
  Gift,
  ArrowLeft,

  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IndividualJobPage() {
  const { jobID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const job = useSelector((state: RootState) => state.individual_job.jobData);
  const loading = useSelector(
    (state: RootState) => state.individual_job.isLoading
  );
  const error = useSelector((state: RootState) => state.individual_job.error);

  useEffect(() => {
    if (jobID) {
      dispatch(fetchIndividualJob({ jobID }));
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading job details...</p>
        </div>
      </>
    );
  }

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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-gray-900"
          onClick={() => navigate("/AllJobs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all jobs
        </Button>

        {/* Job header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-3 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.designation}
                </h1>
                <div className="flex items-center text-lg text-gray-700 mb-4">
                  <Building className="h-5 w-5 mr-2 text-purple-600" />
                  <span className="font-medium">{job.company_name}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    className={`px-3 py-1 ${
                      job.work_environment === "Remote"
                        ? "bg-green-100 text-green-800"
                        : job.work_environment === "Hybrid"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {job.work_environment === "Remote" && "🌎 "}
                    {job.work_environment === "Hybrid" && "🏢/🏠 "}
                    {job.work_environment === "On-site" && "🏢 "}
                    {job.work_environment}
                  </Badge>

                  <Badge variant="outline" className="bg-gray-50">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {job.type_of_employment}
                  </Badge>

                  {job.isFresherEligible && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Fresher Eligible
                    </Badge>
                  )}

                  {job.isVisaSponsored && (
                    <Badge className="bg-indigo-100 text-indigo-800">
                      <Globe className="h-3.5 w-3.5 mr-1" />
                      Visa Sponsored
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      {job.job_location.join(", ") || "Location not specified"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      Experience:{" "}
                      {formatExperience(job.experience_required_in_months)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    <span>CTC: {formatCTC(job.CTC)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Save Job <Star className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Job details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left column - Main job details */}
          <div className="md:col-span-2 space-y-6">
            {/* Job description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold flex items-center mb-4">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  Job Description
                </h2>
                <div className="prose max-w-none text-gray-700">
                  {job.job_description ? (
                    <p>{job.job_description}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No job description provided
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold flex items-center mb-4">
                  <Code className="mr-2 h-5 w-5 text-purple-600" />
                  Required Skills
                </h2>
                {job.skills_required && job.skills_required.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1"
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
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold flex items-center mb-4">
                    <Languages className="mr-2 h-5 w-5 text-purple-600" />
                    Required Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.required_languages.map((language, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1"
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Perks and Benefits */}
            
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold flex items-center mb-4">
                    <Gift className="mr-2 h-5 w-5 text-purple-600" />
                    Perks and Benefits
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{job.perks_and_benefits}</p>
                  </div>
                </CardContent>
              </Card>
            
          </div>

          {/* Right column - Additional requirements */}
          <div className="space-y-6">
            {/* Job Requirements Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Requirements</h2>

                <div className="space-y-4">
                  {/* Experience */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      EXPERIENCE
                    </h3>
                    <p className="font-medium">
                      {formatExperience(job.experience_required_in_months)}
                    </p>
                  </div>

                  <Separator />

                  {/* Education */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      EDUCATION
                    </h3>
                    { 
                      <div className="space-y-1">
                        {job.degree_required.map((degree, index) => (
                          <div key={index} className="flex items-start">
                            <GraduationCap className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                            <span>{degree}</span>
                          </div>
                        ))}
                      </div>
                  
                     
                    }
                  </div>

                  <Separator />

                  {/* Employment Type */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      EMPLOYMENT TYPE
                    </h3>
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {job.type_of_employment}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Work Environment */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      WORK ENVIRONMENT
                    </h3>
                    <div className="flex items-center">
                      {job.work_environment === "Remote" && (
                        <Globe className="h-5 w-5 mr-2 text-gray-400" />
                      )}
                      {job.work_environment === "Hybrid" && (
                        <Building className="h-5 w-5 mr-2 text-gray-400" />
                      )}
                      {job.work_environment === "On-site" && (
                        <Building className="h-5 w-5 mr-2 text-gray-400" />
                      )}
                      <span className="font-medium">
                        {job.work_environment}
                      </span>
                    </div>
                  </div>

                  {/* Bond if applicable */}
                  { (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          BOND REQUIREMENT
                        </h3>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                          <span className="font-medium">{job.bond}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Fresher Eligibility */}
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      FRESHER ELIGIBLE
                    </h3>
                    <div className="flex items-center">
                      {job.isFresherEligible ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                          <span className="font-medium text-green-700">
                            Yes
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2 text-red-500" />
                          <span className="font-medium text-red-700">No</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Visa Sponsorship */}
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      VISA SPONSORSHIP
                    </h3>
                    <div className="flex items-center">
                      {job.isVisaSponsored ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                          <span className="font-medium text-green-700">
                            Available
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2 text-red-500" />
                          <span className="font-medium text-red-700">
                            Not Available
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apply Now Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-purple-900 mb-3">
                  Ready to Apply?
                </h2>
                <p className="text-black mb-4">
                  Submit your application now and take the next step in your
                  career journey.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Apply for this Position
                </Button>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>or</p>
                  <Button
                    variant="link"
                    className="text-purple-600 hover:text-purple-700 p-0 h-auto mt-1"
                  >
                    Save for later <Star className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </>
  );
}
