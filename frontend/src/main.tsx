import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Slice/Store";
import RecruiterPersonalInformation from "./Recruiter/RecruiterPersonalInformation";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import RecruiterConventionalEducation from "./Recruiter/RecruiterConventionalEducation";
import CandidateLogin from "./Candidate/CandidateLogin";
import CandidatePersonalInformation from "./Candidate/CandidatePersonalInformation";
import RecruiterLogin from "./Recruiter/RecruiterLogin";
import CandidateSkillsAndExperience from "./Candidate/CandidateSkillsAndExperience";
import CommonAuthentication from "./Pages/CommonAuthentication";
import RecruiterListing from "./Pages/RecruiterListing";
import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import CandidatePresent from "./Candidate/CandidatePresent";
import { RecruiterAuthProvider } from "./context/RecruiterContext";
import RecruiterSkillsAndExperience from "./Recruiter/RecruiterSkillsAndExperience";
import RecruiterPresent from "./Recruiter/RecruiterPresent";
import CandidateAuthProvider from "./context/CandidateContext";
import CandidateEducationForm from "./Candidate/CandidateConventionalEducation";
import CandidateDashboard from "./Candidate/CandidateDashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/RecruiterPersonalInformation",
    element: <RecruiterPersonalInformation />,
    errorElement: <Error />,
  },
  {
    path: "/RecruiterConventionalEducation",
    element: <RecruiterConventionalEducation />,
    errorElement: <Error />,
  },
  {
    path: "/RecruiterSkillsAndExperience",
    element: <RecruiterSkillsAndExperience />,
    errorElement: <Error />,
  },
  {
    path: "/RecruiterPresent",
    element: <RecruiterPresent />,
    errorElement: <Error />,
  },

  {
    path: "/RecruiterLogin",
    element: <RecruiterLogin />,
    errorElement: <Error />,
  },

  {
    path: "/CommonAuthentication",
    element: <CommonAuthentication />,
    errorElement: <Error />,
  },

  {
    path: "/RecruiterDashboard",
    element: <RecruiterDashboard />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateLogin",
    element: <CandidateLogin />,
    errorElement: <Error />,
  },
  {
    path: "/CandidatePersonalInformation",
    element: <CandidatePersonalInformation />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateConventionalEducation",
    element: <CandidateEducationForm />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateSkillsAndExperience",
    element: <CandidateSkillsAndExperience />,
    errorElement: <Error />,
  },
  {
    path: "/CandidatePresent",
    element: <CandidatePresent />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateDashboard",
    element: <CandidateDashboard />,
    errorElement: <Error />,
  },
  {
    path:"/TopRecruiters",
    element:<RecruiterListing/>,
    errorElement:<Error/>
  }
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RecruiterAuthProvider>
      <CandidateAuthProvider>
        <RouterProvider router={router} />
      </CandidateAuthProvider>
    </RecruiterAuthProvider>
  </Provider>
);
