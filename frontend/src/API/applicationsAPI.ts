import axios from "axios";
export const applicationsApi= axios.create({
  baseURL: "http://localhost:5000/applications",
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