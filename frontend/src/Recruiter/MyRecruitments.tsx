import Navbar from "@/components/ui/navbar";
import {
  Briefcase,
  Building,
  DollarSign,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppDispatch, RootState } from "@/Slice/Store";
import { recruiterJobListingThunk } from "@/Slice/JobApplicationThunk";
import { useContext } from "react";
import { RecruiterAuthContext } from "@/context/CreateContext";
import { recruiterLogout } from "@/Slice/RecruiterThunk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteJobPostingThunk } from "@/Slice/JobThunk";

function MyRecruitments() {
  const dispatch = useDispatch<AppDispatch>();
  const recruiterUsername = localStorage.getItem("recruiterUsername");
  const allJobs = useSelector(
    (state: RootState) => state.allRecruitmentsByRecruiter.recruitment
  );
  const isLoading = useSelector(
    (state: RootState) => state.allRecruitmentsByRecruiter.isLoading
  );

  const isSuccess: boolean = useSelector(
    (state: RootState) => state.allRecruitmentsByRecruiter.isSuccess
  );

  useEffect(() => {
    const renderApplications = async () => {
      const recruiterUsername = localStorage.getItem("recruiterUsername");
      if (recruiterUsername) {
        try {
          await dispatch(
            recruiterJobListingThunk({ recruiterUsername })
          ).unwrap();
        } catch (err) {
          console.error("Failed to fetch job applications:", err);
        }
      }
    };
    renderApplications();
  }, [dispatch]);
  const authContext = useContext(RecruiterAuthContext);
  if (!authContext) throw new Error("RecruiterAuthContext not found");

  const { logout } = authContext;
  const nav = useNavigate();
  const userLogout = () => {
    if (recruiterUsername) dispatch(recruiterLogout(recruiterUsername));
    logout();
    setTimeout(() => {
      nav("/");
    }, 500);
  };
  const recruiterData = useSelector(
    (state: RootState) => state.recruiterDashboard.recruiterData
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const storageUsername = localStorage.getItem("recruiterUsername");

      if (storageUsername !== recruiterData.username) {
        userLogout();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [recruiterData.username]);
  const getWorkEnvironmentColor = (environment: string) => {
    switch (environment) {
      case "Remote":
        return "bg-green-100 text-green-800";
      case "Hybrid":
        return "bg-blue-100 text-blue-800";
      case "On-site":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-purple-100 text-purple-800";
      case "Part-time":
        return "bg-indigo-100 text-indigo-800";
      case "Contract-based":
        return "bg-pink-100 text-pink-800";
      case "Project-based":
        return "bg-cyan-100 text-cyan-800";
      case "Internship":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const deleteJob = async (jobID: string) => {
    console.log(jobID)
    const response = await dispatch(deleteJobPostingThunk({ jobID })).unwrap();
    if (response.success) {
      alert("Job deleted successfully!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Back to dashboard button */}
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-white"
          onClick={() => {
            nav("/RecruiterDashboard");
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>
        {/*Loading state*/}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="w-full">
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* In case recruiter has no active recruitments*/}

        {!isLoading && allJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground text-center text-sm max-w-md">
              This job posting hasn't received any applications yet. Check back
              later or promote your job listing.
            </p>
          </div>
        )}
        {/* When there are active recruitments */}
        {isSuccess && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map((job) => (
              <Card
                key={job.jobID}
                className="w-full border border-gray-200 overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="font-medium text-base line-clamp-1"
                      title={job.designation}
                    >
                      {job.designation}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0.5 h-5 ml-1 shrink-0"
                    >
                      {job.jobID}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Building className="h-4 w-4 mr-1 shrink-0" />
                    <span className="line-clamp-1" title={job.company_name}>
                      {job.company_name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      className={`${getWorkEnvironmentColor(
                        job.work_environment
                      )} text-xs px-2 py-0.5`}
                    >
                      {job.work_environment}
                    </Badge>
                    <Badge
                      className={`${getEmploymentTypeColor(
                        job.type_of_employment
                      )} text-xs px-2 py-0.5`}
                    >
                      {job.type_of_employment}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-1 mb-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground shrink-0" />
                      <span
                        className="line-clamp-1"
                        title={job.job_location.join(", ")}
                      >
                        {job.job_location.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground shrink-0" />
                      <span
                        className="line-clamp-1"
                        title={`${job.CTC.minCTC} - ${job.CTC.maxCTC}`}
                      >
                        {job.CTC.minCTC} - {job.CTC.maxCTC}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        deleteJob(job.jobID);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        nav(`/job/${job.jobID}`);
                      }}
                    >
                      View Job
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        nav(`/RecruiterDashboard/MyRecruitments/${job.jobID}`);
                      }}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyRecruitments;
