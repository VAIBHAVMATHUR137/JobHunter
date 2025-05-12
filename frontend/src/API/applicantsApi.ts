import axios from "axios";
export const applicantsApi= axios.create({
  baseURL: "http://localhost:5000/applicants",
});
