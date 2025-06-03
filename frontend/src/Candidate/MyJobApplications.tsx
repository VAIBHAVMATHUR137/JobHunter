import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Slice/Store";
import { candidateJobApplicationThunk } from "@/Slice/JobApplicationThunk";
import Navbar from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building,
  DollarSign,
  MapPin,
  AtSignIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateAuthContext } from "@/context/CreateContext";
import { useContext } from "react";
import { candidateDashboard, candidateLogout } from "@/Slice/CandidateThunk";

function MyJobApplications() {
  const dispatch = useDispatch<AppDispatch>();

  const nav = useNavigate();
  const candidateUsername = localStorage.getItem("candidateUsername");
  const { jobData, isLoading, error, isSuccess } = useSelector(
    (state: RootState) => state.jobsAppliedByCandidate
  );
  const candidateData = useSelector(
    (state: RootState) => state.candidateDashboard.candidateData
  );

  const authContext = useContext(CandidateAuthContext);
  if (!authContext) throw new Error("CandidateAuthContext not found");

  const { logout } = authContext;
  useEffect(() => {
    if (candidateUsername) {
      dispatch(candidateDashboard({ username: candidateUsername }));
    }
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (candidateUsername !== candidateData.username) {
        userLogout();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [candidateData.username]);

  useEffect(() => {
    const renderApplications = async () => {
      const candidateUsername = localStorage.getItem("candidateUsername");
      if (candidateUsername) {
        try {
          await dispatch(
            candidateJobApplicationThunk({ candidateUsername })
          ).unwrap();
        } catch (err) {
          console.error("Failed to fetch job applications:", err);
        }
      }
    };
    renderApplications();
  }, [dispatch]);

  const userLogout = () => {
    dispatch(candidateLogout(candidateData.username));
    logout();
    setTimeout(() => {
      nav("/");
    }, 1500);
  };

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
  const handleJobCardClick = (jobId: string) => {
    nav(`/job/${jobId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            My Job Applications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track all the jobs you've applied for
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="w-full h-40">
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-3" />
                  <div className="flex gap-1 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full mt-2" />
                  <Skeleton className="h-3 w-2/3 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
            Error loading your job applications. Please try again later.
          </div>
        )}

        {!isLoading && isSuccess && jobData && jobData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <Briefcase className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No applications yet</h3>
            <p className="text-muted-foreground text-center text-sm max-w-md">
              You haven't applied to any jobs yet. Browse available positions
              and start your application journey.
            </p>
          </div>
        )}

        {!isLoading && isSuccess && jobData && jobData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
            {jobData.map((job, index) => (
              <Card
                key={index}
                className="w-full hover:shadow-md transition-shadow border border-gray-200 overflow-hidden
                cursor-pointer
                "
                onClick={() =>
                  handleJobCardClick(job.jobID || index.toString())
                }
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className="font-medium text-sm line-clamp-1"
                      title={job.designation}
                    >
                      {job.designation}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 h-4 ml-1 shrink-0"
                    >
                      {job.jobID}
                    </Badge>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Building className="h-3 w-3 mr-1 shrink-0" />
                    <span className="line-clamp-1" title={job.company_name}>
                      {job.company_name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge
                      className={`${getWorkEnvironmentColor(
                        job.work_environment
                      )} text-[10px] px-1 py-0 h-4`}
                    >
                      {job.work_environment}
                    </Badge>
                    <Badge
                      className={`${getEmploymentTypeColor(
                        job.type_of_employment
                      )} text-[10px] px-1 py-0 h-4`}
                    >
                      {job.type_of_employment}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex items-center text-xs">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground shrink-0" />
                      <span
                        className="line-clamp-1"
                        title={job.job_location.join(", ")}
                      >
                        {job.job_location.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center text-xs">
                      <DollarSign className="h-3 w-3 mr-1 text-muted-foreground shrink-0" />
                      <span
                        className="line-clamp-1"
                        title={`${job.CTC.minCTC} - ${job.CTC.maxCTC}`}
                      >
                        {job.CTC.minCTC} - {job.CTC.maxCTC}
                      </span>
                    </div>

                    <div className="flex items-center text-xs">
                      <AtSignIcon className="h-3 w-3 mr-1  shrink-0" />
                      <span className="line-clamp-1" title={job.username}>
                        {job.username}
                      </span>
                    </div>
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

export default MyJobApplications;
