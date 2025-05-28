import axios from "axios";
export const jobApi = axios.create({
  baseURL: "https://jobhunter-1-o7zz.onrender.com/job",
});