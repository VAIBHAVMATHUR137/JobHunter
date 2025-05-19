import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Slice/Store";
import { recruiterJobListingThunk } from "@/Slice/JobApplicationThunk";
import { useContext } from "react";
import { RecruiterAuthContext } from "@/context/CreateContext";
import { recruiterLogout } from "@/Slice/RecruiterThunk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function MyRecruitments() {
  const dispatch = useDispatch<AppDispatch>();
  const recruiterUsername = localStorage.getItem("recruiterUsername");

  const getRecruitments = async () => {
    if (recruiterUsername) {
      const response = await dispatch(
        recruiterJobListingThunk({ recruiterUsername })
      ).unwrap();
      console.log(response);
    }
  };
  const authContext = useContext(RecruiterAuthContext);
  if (!authContext) throw new Error("RecruiterAuthContext not found");

  const { logout } = authContext;
  const nav = useNavigate();
  const userLogout = () => {
    if (recruiterUsername) dispatch(recruiterLogout(recruiterUsername));
    logout();
    setTimeout(() => {
      nav("/");
    }, 1500);
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

      <Button onClick={getRecruitments}>Get Recruitments</Button>
    </>
  );
}

export default MyRecruitments;
