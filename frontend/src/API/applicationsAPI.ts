import axios from "axios";
export const applicationsApi= axios.create({
  baseURL: "http://localhost:5000/applications",
});
