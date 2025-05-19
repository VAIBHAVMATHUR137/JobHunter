import Navbar from "@/components/ui/navbar";
import { candidateJobApplicationThunk, jobApplicantsThunk, recruiterJobListingThunk } from "@/Slice/JobApplicationThunk";
import { AppDispatch, RootState } from "@/Slice/Store";
import { useDispatch, useSelector } from "react-redux";

function Test() {
  const dispatch = useDispatch<AppDispatch>();

  const candidateUsername: string = useSelector(
    (state: RootState) => state.candidateDashboard.candidateData.username
  );


  const recruiterUsername:string=useSelector((state:RootState)=>state.recruiterDashboard.username)
  console.log(recruiterUsername)
  const applications=useSelector((state:RootState)=>state.allApplicantsForJob.applicant)
  const recruitment=useSelector((state:RootState)=>state.allRecruitmentsByRecruiter.recruitment)
  const jobs = useSelector(
    (state: RootState) => state.jobsAppliedByCandidate.jobData
  );



  const thunkTester = async () => {
    const response = await dispatch(
      candidateJobApplicationThunk({ candidateUsername })
    ).unwrap();
    console.log(response);
    console.log(jobs);
  };
  
  const thunkOneTester=async()=>{
    const response=await dispatch(recruiterJobListingThunk({recruiterUsername})).unwrap();
    console.log(response);
    console.log(recruitment)
  }
  const thunkThreeTester=async()=>{
    const jobID="NUY718";
    const response=await dispatch(jobApplicantsThunk({recruiterUsername,jobID})).unwrap();
    console.log(response)
    console.log(applications)
  }

  return (
    <>
      <Navbar />
      <div>
              <button onClick={thunkTester} className="text-white m-5">API Two</button>
      </div>
      <div>
        <button onClick={thunkOneTester} className="text-white m-5"> API One</button>
      </div>
      <div>
        <button  onClick={thunkThreeTester}className="text-white m-4">API Three</button>
      </div>

    </>
  );
}

export default Test;
