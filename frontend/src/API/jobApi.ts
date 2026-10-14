import axios from "axios";
import { url } from "./baseURL";
export const jobApi = axios.create({
  baseURL: `${url}/job`,
});