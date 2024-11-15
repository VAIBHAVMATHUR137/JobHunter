import "./index.css";

import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./Slice/Store";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import CandidateLogin from "./Pages/CandidateLogin";
import CandidateRegistration from "./Pages/CandidateRegistration";
import RecruiterLogin from "./Pages/RecruiterLogin";
import RecruiterRegistration from "./Pages/RecruiterRegistration";
import CommonAuthentication from "./Pages/CommonAuthentication";
import CandidateDashboard from "./Pages/CandidateDashboard";
import RecruiterDashboard from "./Pages/RecruiterDashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateLogin",
    element: <CandidateLogin />,
    errorElement: <Error />,
  },
  {
    path: "/CandidateSignup",
    element: <CandidateRegistration />,
    errorElement: <Error />,
  },
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
  {
    path: "/CandidateDashboard",
    element: <CandidateDashboard />,
    errorElement: <Error />,
  },
  {
    path: "/RecruiterDashboard",
    element: <RecruiterDashboard />,
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
