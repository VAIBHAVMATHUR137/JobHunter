import axios from "axios";
import { url } from "./baseURL";
export const applicationsApi= axios.create({
  baseURL: `${url}/applications`,
});

export const addAuthHeaderForCandidate = () => {

  const token = localStorage.getItem("candidateAccessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const addAuthHeaderForRecruiter = () => {

  const token = localStorage.getItem("recruiterAccessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};