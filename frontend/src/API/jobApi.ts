import axios from "axios";
export const jobApi = axios.create({
  baseURL: "https://jobhunter-2-firj.onrender.com/job",
});