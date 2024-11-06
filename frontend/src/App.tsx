import React from "react";
import axios, { AxiosResponse } from "axios";
import "./App.css";
import Home from "./Pages/Home";


async function getData() {
  interface Candidate {
    name: string;
    email: string;
    number: number;
    password: string;
    current_location: string;
    degree: string;
    skills: string[];
    college_name: string;
    college_tier: string;
    preferred_location: string[];
    notice_period: number;
    years_of_experience: number;
    github: string;
    xProfile?: string;
    linkedin: string;
    portfolio?: string;
  }

  try {
    const response: AxiosResponse<Candidate[]> = await axios.get<Candidate[]>(
      "http://localhost:5000/candidate/getAllCandidates"
    );
    console.log(response.data.filter((candidate)=>candidate.years_of_experience>=2).map((candidate)=>candidate.name));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching data:", error.message); // handle Axios error
    } else {
      console.error("Unexpected error:", error); // handle other errors
    }
  }
}
getData();
function App() {
  return (
    <>
      <Home />
      

    </>
  );
}

export default App;