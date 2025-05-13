import { createAsyncThunk } from "@reduxjs/toolkit";
import { applicationsApi } from "@/API/applicationsAPI";
import axios from "axios";

interface application {
  recruiterUsername?: string;
  jobID: string;
  candidateUsername: string;
}

interface ErrorResponse {
  status: number;
  message: string;
}

//This thunk checks if candidate is not applying for same job multiple times

export const screenApplicationThunk = createAsyncThunk<
  {
    result: {
      remarks: string;
      success: boolean;
      status: number;
    };
  },
  application,
  { rejectValue: ErrorResponse }
>("application/screening", async (data, { rejectWithValue }) => {
  try {
    const response = await applicationsApi.post("/screen", data);

    if (response.status === 200) {
      return {
        result: {
          remarks: "Candidate can apply",
          success: true,
          status: 200,
        },
      };
    } else if (response.status === 403) {
      return {
        result: {
          remarks: "Candidate already applied. Not allowed",
          success: false,
          status: 403,
        },
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to screen application",
        status: error.response?.status || 500,
      });
    }
  }

  return {
    result: {
      remarks: "Issue at backend, please apply later",
      success: false,
      status: 500,
    },
  };
});

//Candidate can apply for the job using this thunk API
export const createApplicationThunk = createAsyncThunk<
  { success: boolean },
  application,
  { rejectValue: ErrorResponse }
>("job/application", async (data, { rejectWithValue }) => {
  const response = await applicationsApi.post("/create", data);
  try {
    if (response.status === 200) {
      return { success: true };
    }
    return rejectWithValue({
      message: "Registration failed",
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete recruiter",
        status: error.status || 500,
      });
    }
  }
  return {
    success: false,
  };
});
