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
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path:"/CandidateLogin",
    element:<CandidateLogin/>,
    errorElement:<Error/>
  }
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
