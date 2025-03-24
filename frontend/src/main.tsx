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

import RecruiterLogin from "./Pages/RecruiterLogin";

import CommonAuthentication from "./Pages/CommonAuthentication";

import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import JobPosting from "./Pages/JobPosting";
import { AuthProvider } from "./context/Context";
import RecruiterSkillsAndExperience from "./Recruiter/RecruiterSkillsAndExperience";
import RecruiterPresent from "./Recruiter/RecruiterPresent";
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
  {
    path:"/RecruiterPresent",
    element:<RecruiterPresent/>,
    errorElement:<Error/>
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
    path: "/RecruiterDashboard/:username",
    element: <RecruiterDashboard />,
    errorElement: <Error />,
  },
  {
    path: "/JobPosting",
    element: <JobPosting />,
    errorElement: <Error />,
  },
],

);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);
