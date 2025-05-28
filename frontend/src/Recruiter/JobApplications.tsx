import { useContext } from "react";
import { RecruiterAuthContext } from "@/context/CreateContext";
import Navbar from "@/components/ui/navbar"
import { jobApplicantsThunk } from "@/Slice/JobApplicationThunk"
import type { AppDispatch, RootState } from "@/Slice/Store"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GraduationCap } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { recruiterLogout } from "@/Slice/RecruiterThunk";


function JobApplications() {
  const { jobID } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const nav=useNavigate()
  const { applicant, isLoading, error } = useSelector((state: RootState) => state.allApplicantsForJob)
 const recruiterUsername = localStorage.getItem("recruiterUsername");
  useEffect(() => {
    const renderApplicants = async () => {
      const recruiterUsername = localStorage.getItem("recruiterUsername")
      if (recruiterUsername && jobID) {
        const response = await dispatch(jobApplicantsThunk({ recruiterUsername, jobID })).unwrap()
        console.log(response)
      }
    }
    renderApplicants()
  }, [dispatch, jobID])
  
    const authContext = useContext(RecruiterAuthContext);
  if (!authContext) throw new Error("RecruiterAuthContext not found");

  const { logout } = authContext;

    const userLogout = () => {
      if (recruiterUsername) 
        dispatch(recruiterLogout(recruiterUsername));
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



  return (
    <>
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Job Applicants</h1>

        {isLoading ? (
          <div className="text-center py-8">Loading applicants...</div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {applicant.map((candidate, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border shadow-sm p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    {candidate.photo ? (
                      <AvatarImage src={candidate.photo || "/placeholder.svg"} alt={candidate.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {candidate.firstName?.charAt(0)}
                        {candidate.lastName?.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <h3 className="font-medium">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">@{candidate.username}</p>
                  </div>
                </div>

                {candidate.college_education && candidate.college_education[0] && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span className="truncate">{candidate.college_education[0].college_name}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {candidate.core_skills?.slice(0, 4).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="font-normal text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.core_skills?.length > 4 && (
                    <Badge variant="outline" className="font-normal text-xs">
                      +{candidate.core_skills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default JobApplications
