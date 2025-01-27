import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Slice/Store";
import RecruiterPersonalInformation from "./Recruiter/RecruiterPersonalInformation";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import RecruiterConventionalEducation from "./Recruiter/RecruiterConventionalEducation";
// import CandidateLogin from "./Pages/CandidateLogin";
// import CandidateRegistration from "./Pages/CandidateRegistration";
import RecruiterLogin from "./Pages/RecruiterLogin";
import RecruiterRegistration from "./Pages/RecruiterRegistration";
import CommonAuthentication from "./Pages/CommonAuthentication";
// import CandidateDashboard from "./Pages/CandidateDashboard";
// import RecruiterDashboard from "./Pages/RecruiterDashboard";
import JobPosting from "./Pages/JobPosting";
import { AuthProvider } from "./context/Context";
import RecruiterSkillsAndExperience from "./Recruiter/RecruiterSkillsAndExperience";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path:"/RecruiterPersonalInformation",
    element:<RecruiterPersonalInformation />,
    errorElement:<Error/>
  },
  {
    path:"/RecruiterConventionalEducation",
    element:<RecruiterConventionalEducation/>,
    errorElement:<Error/>
  },
  {
    path:"/RecruiterSkillsAndExperience",
    element:<RecruiterSkillsAndExperience/>,
    errorElement:<Error/>
  },
  // {
  //   path: "/CandidateLogin",
  //   element: <CandidateLogin />,
  //   errorElement: <Error />,
  // },
  // {
  //   path: "/CandidateSignup",
  //   element: <CandidateRegistration />,
  //   errorElement: <Error />,
  // },
  {
    path: "/RecruiterLogin",
    element: <RecruiterLogin />,
    errorElement: <Error />,
  },
  {
    path: "/RecruiterSignUp",
    element: <RecruiterRegistration />,
    errorElement: <Error />,
  },
  {
    path: "/CommonAuthentication",
    element: <CommonAuthentication />,
    errorElement: <Error />,
  },
  // {
  //   path: "/CandidateDashboard",
  //   element: <CandidateDashboard />,
  //   errorElement: <Error />,
  // },
  // {
  //   path: "/RecruiterDashboard/:username",
  //   element: <RecruiterDashboard />,
  //   errorElement: <Error />,
  // },
  {
    path: "/JobPosting",
    element: <JobPosting />,
    errorElement: <Error />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);
