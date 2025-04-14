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

import RecruiterLogin from "./Recruiter/RecruiterLogin";

import CommonAuthentication from "./Pages/CommonAuthentication";

import RecruiterDashboard from "./Recruiter/RecruiterDashboard";

import { RecruiterAuthProvider } from "./context/RecruiterContext";
import RecruiterSkillsAndExperience from "./Recruiter/RecruiterSkillsAndExperience";
import RecruiterPresent from "./Recruiter/RecruiterPresent";
import CandidateAuthProvider from "./context/CandidateContext";
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
    path: "/RecruiterDashboard/:username",
    element: <RecruiterDashboard />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateLogin",
    element: <CandidateLogin />,
    errorElement: <Error />,
  },
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
