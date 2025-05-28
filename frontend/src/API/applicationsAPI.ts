import axios from "axios";
export const applicationsApi= axios.create({
  baseURL: "https://jobhunter-1-o7zz.onrender.com/applications",
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