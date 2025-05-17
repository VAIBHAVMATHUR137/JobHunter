import Navbar from "@/components/ui/navbar";
import { candidateJobApplicationThunk, recruiterJobListingThunk } from "@/Slice/JobApplicationThunk";
import { AppDispatch, RootState } from "@/Slice/Store";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

function Test() {
  const dispatch = useDispatch<AppDispatch>();

  const candidateUsername: string = useSelector(
    (state: RootState) => state.candidateDashboard.candidateData.username
  );


  const recruiterUsername:string=useSelector((state:RootState)=>state.recruiterDashboard.username)
  console.log(recruiterUsername)

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
  return (
    <>
      <Navbar />
      <div>
              <button onClick={thunkTester} className="text-white m-5">API Two</button>
      </div>
      <div>
        <button onClick={thunkOneTester} className="text-white m-5"> API One</button>
      </div>

    </>
  );
}

export default Test;
