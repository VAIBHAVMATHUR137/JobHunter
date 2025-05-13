import Navbar from "@/components/ui/navbar";
import { fetchAllJobs, fetchIndividualJob } from "@/Slice/JobThunk";
import type { AppDispatch, RootState } from "@/Slice/Store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { screenApplicationThunk } from "@/Slice/JobApplicationThunk";

function JobListing() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();




  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);
  // Get jobs data from Redux store
  const jobsData = useSelector((state: RootState) => state.allJobs);


  // Handle job card click to navigate to job details
  const handleJobCardClick = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  // Format CTC range
  const formatCTC = (ctc: { minCTC: string; maxCTC: string }) => {
    if (!ctc.minCTC && !ctc.maxCTC) return "Not specified";
    if (ctc.minCTC && ctc.maxCTC) return `${ctc.minCTC} - ${ctc.maxCTC}`;
    return ctc.minCTC || ctc.maxCTC;
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg md:text-xl text-center text-purple-100 max-w-2xl mx-auto">
            Discover opportunities that match your skills and career aspirations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Bar */}
        {!jobsData.isLoading &&
          !jobsData.error &&
          jobsData.jobData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {jobsData.jobData.length}
                </p>
                <p className="text-gray-600">Total Jobs</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {
                    jobsData.jobData.filter(
                      (job) => job.work_environment === "Remote"
                    ).length
                  }
                </p>
                <p className="text-gray-600">Remote Jobs</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-3xl font-bold text-violet-600">
                  {
                    jobsData.jobData.filter((job) => job.isFresherEligible)
                      .length
                  }
                </p>
                <p className="text-gray-600">Fresher Friendly</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-3xl font-bold text-fuchsia-600">
                  {
                    jobsData.jobData.filter(
                      (job) => job.type_of_employment === "Full-time"
                    ).length
                  }
                </p>
                <p className="text-gray-600">Full-time</p>
              </div>
            </div>
          )}

        {/* Loading State */}
        {jobsData.isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            <p className="mt-4 text-lg text-gray-600">
              Finding amazing opportunities for you...
            </p>
          </div>
        ) : jobsData.error ? (
          // Error State
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="inline-flex h-12 w-12 rounded-full bg-red-100 text-red-500 items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Unable to load jobs
            </h3>
            <p className="text-red-600">{jobsData.error}</p>
            <Button
              variant="outline"
              className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => dispatch(fetchAllJobs())}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsData.jobData.map((job, index) => (
                <Card
                  key={job.work_environment || index}
                  className="group w-full bg-white border-0 overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Card content that's clickable */}
                  <div
                    className="cursor-pointer h-full"
                    onClick={() =>
                      handleJobCardClick(
                        job.jobID || index.toString()
                      )
                    }
                  >
                    {/* Company badge at top */}
                    <div className="h-3 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                    <CardContent className="p-6">
                      {/* Job title and company */}
                      <div className="mb-4">
                        <h3 className="font-bold text-xl text-gray-800 group-hover:text-purple-700 transition-colors">
                          {job.designation}
                        </h3>
                        <div className="flex items-center mt-1 text-gray-600">
                          <Building className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium">
                            {job.company_name}
                          </span>
                        </div>
                      </div>

                      {/* Work environment badge */}
                      <Badge
                        className={`mb-4 px-3 py-1 ${
                          job.work_environment === "Remote"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : job.work_environment === "Hybrid"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                      >
                        {job.work_environment === "Remote" && "🌎 "}
                        {job.work_environment === "Hybrid" && "🏢/🏠 "}
                        {job.work_environment === "On-site" && "🏢 "}
                        {job.work_environment}
                      </Badge>

                      {/* Job details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">
                            {job.job_location.join(", ")}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{job.type_of_employment}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {job.experience_required_in_months
                              ? `${Math.floor(
                                  Number.parseInt(
                                    job.experience_required_in_months
                                  ) / 12
                                )} years exp.`
                              : "Experience not specified"}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatCTC(job.CTC)}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills_required.slice(0, 3).map((skill, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-gray-50 text-gray-700 border-gray-200 font-normal"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills_required.length > 3 && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 border-gray-200 font-normal"
                          >
                            +{job.skills_required.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Special badges */}
                      <div className="flex flex-wrap gap-2">
                        {job.isFresherEligible && (
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                            <Star className="h-3 w-3 mr-1" /> Fresher Eligible
                          </Badge>
                        )}

                        {job.isVisaSponsored && (
                          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                            Visa Sponsored
                          </Badge>
                        )}
                      </div>

                      {/* View details button */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 group-hover:translate-x-1 transition-transform"
                        >
                          View Details <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {jobsData.jobData.length === 0 && (
              <div className="text-center bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
                <div className="inline-flex h-16 w-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any job listings at the moment.
                </p>
                <Button onClick={() => dispatch(fetchAllJobs())}>
                  Refresh Jobs
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default JobListing;
