import Navbar from "@/components/ui/navbar";
import { candidateJobApplicationThunk } from "@/Slice/JobApplicationThunk";
import { AppDispatch, RootState } from "@/Slice/Store";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

function Test() {
  const dispatch = useDispatch<AppDispatch>();

  const candidateUsername: string = useSelector(
    (state: RootState) => state.candidateDashboard.candidateData.username
  );
  console.log(candidateUsername);
  const jobs = useSelector(
    (state: RootState) => state.jobsAppliedByCandidate.jobData
  );

  const testingAPITwo = async (candidateUsername:string) => {
    try {
      // For GET requests, parameters should be passed in the URL as query parameters
      const response = await axios.get(
        `http://localhost:5000/applications/jobStatus?candidateUsername=${candidateUsername}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  testingAPITwo(candidateUsername);

  const thunkTester = async () => {
    const response = await dispatch(
      candidateJobApplicationThunk({ candidateUsername })
    ).unwrap();
    console.log(response);
    console.log(jobs);
  };

  return (
    <>
      <Navbar />
      <button onClick={thunkTester} className="text-white">API Two</button>
    </>
  );
}

export default Test;
