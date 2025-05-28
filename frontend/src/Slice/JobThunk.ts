import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobApi } from "@/API/jobApi";
import axios from "axios";
import { resetJob } from "./JobPostingSlice";

type WorkEnvironment = "Remote" | "Hybrid" | "On-site";
type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract-based"
  | "Project-based"
  | "Internship";
type CTC = {
  minCTC: string;
  maxCTC: string;
};
const initialWorkEnvironment: WorkEnvironment = "Hybrid";
const initialEmploymentType: EmploymentType = "Full-time";
const initialCTC: CTC = {
  minCTC: "",
  maxCTC: "",
};
interface JobPosting {
  designation: string;
  CTC: CTC;
  experience_required_in_months: string;
  isFresherEligible: boolean;
  degree_required: string[];
  bond: string;
  work_environment: WorkEnvironment;
  job_location: string[];
  company_name: string;
  skills_required: string[];
  job_description: string;
  type_of_employment: EmploymentType;
  perks_and_benefits: string;
  required_languages: string[];
  isVisaSponsored: boolean;
  username: string;
  name: string;
  email: string;
  jobID: string;
}
const initialJobPosting: JobPosting = {
  designation: "",
  CTC: initialCTC,
  experience_required_in_months: "",
  isFresherEligible: false,
  degree_required: [],
  bond: "",
  work_environment: initialWorkEnvironment,
  job_location: [],
  company_name: "",
  job_description: "",
  skills_required: [],
  type_of_employment: initialEmploymentType,
  perks_and_benefits: "",
  required_languages: [],
  isVisaSponsored: false,
  username: "",
  name: "",
  email: "",
  jobID: "",
};

//FETCH INDIVIDUAL JOB
export const fetchIndividualJob = createAsyncThunk<
  JobPosting,
  { jobID: string },
  { rejectValue: { message: string; status: number } }
>("/job/fetchIndividual", async ({ jobID }, { rejectWithValue }) => {
  try {
    const response = await jobApi.get(`/fetchIndividualJob/${jobID}`);
    if (response.status === 200) {
      return response.data;
    }
    return rejectWithValue({
      message: "Failed to fetch job details",
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch job details",
        status: error.response?.status || 500,
      });
    }

    return rejectWithValue({
      message: "An unknown error occurred",
      status: 500,
    });
  }
});

interface fetchIndividualJob {
  isLoading: boolean;
  isSuccess: boolean;
  isFail: boolean;
  jobData: JobPosting;
  error: string | null;
}
const initialIndividualJob: fetchIndividualJob = {
  isLoading: false,
  isSuccess: false,
  isFail: true,
  error: null,
  jobData: initialJobPosting,
};

export const individualJobSlice = createSlice({
  name: "individualJobSlice",
  initialState: initialIndividualJob,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndividualJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIndividualJob.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.isFail = false;
        state.jobData = action.payload;
      })
      .addCase(fetchIndividualJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch recruiter details";
        state.isSuccess = false;
        state.isFail = true;
        state.jobData = initialJobPosting;
      });
  },
});
//THUNK FOR ALL THE JOBS

export const fetchAllJobs = createAsyncThunk<
  JobPosting[],
  { username: string | null },
  { rejectValue: { message: string; status: number } }
>("job/fetchAll", async (data, { rejectWithValue }) => {
  try {
    // Built URL conditionally, only add username param if it exists
    const url = data.username ? `/fetch?username=${data.username}` : "/fetch";
    const response = await jobApi.get(url);

    if (response.status === 200) {
      return response.data;
    }
    return rejectWithValue({
      message: "Failed to fetch candidate details",
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch candidate details",
        status: error.response?.status || 500,
      });
    }
  }
  return rejectWithValue({
    message: "An unknown error occurred",
    status: 500,
  });
});

interface getAllJobs {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isFail: boolean;
  jobData: JobPosting[];
}
const initialAllJobsState: getAllJobs = {
  isLoading: false,
  error: null,
  isSuccess: true,
  isFail: false,
  jobData: [initialJobPosting],
};
export const allJobsSlice = createSlice({
  name: "allJobsSlice",
  initialState: initialAllJobsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.isLoading = true;

        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isFail = false;
        state.isSuccess = true;
        state.jobData = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch Jobs";
        state.isSuccess = false;
        state.jobData = [initialJobPosting];
      });
  },
});

export const createJobThunk = createAsyncThunk<
  { success: boolean },
  JobPosting,
  { rejectValue: ErrorResponse }
>("/jobPosting/Create", async (data, { dispatch, rejectWithValue }) => {
  try {
    const jobIDGenerate = await dispatch(
      generateJobID({
        username: data.username,
        jobID: data.jobID,
      })
    ).unwrap();
    if (!jobIDGenerate.success) {
      return rejectWithValue({
        message: "JobID  is already taken",
        status: 409,
      });
    }
    const response = await jobApi.post("/create", data);
    //if job posting successful
    if (response.status === 201) {
      const resetFields = [
        "designation",
        "CTC",
        "experience_required_in_months",
        "isFresherEligible",
        "degree_required",
        "bond",
        "work_environment",
        "job_location",
        "company_name",
        "skills_required",
        "job_description",
        "type_of_employment",
        "perks_and_benefits",
        "required_languages",
        "isVisaSponsored",
        "username",
        "name",
        "email",
        "jobID",
      ] as const;
      resetFields.forEach((field) => {
        dispatch(resetJob({ field }));
      });
      return { success: true };
    }
    return rejectWithValue({
      message: "Registration failed",
      status: response.status,
    });
  } catch (error) {
    return rejectWithValue({
      message: "An unknown error occured",
      status: 500,
    });
  }
});
//Delete Job
let message:string;
export const deleteJobPostingThunk = createAsyncThunk<
  { success: boolean },
  { jobID: string },
  { rejectValue: ErrorResponse }
>("jobPosting/delete", async (jobID, { rejectWithValue }) => {
  try {
    const response = await jobApi.delete(`/delete/${jobID.jobID}`);
    if (response.status === 200) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response?.status;
       message = "Unknown error occured";
      switch (status) {
        case 404:
          message = "Job you want to delete is not found";
          break;
        default:
          message = error.response?.data?.message || "Deletion failed";
      }
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete job",
        status: 500,
      });
    }
  }
  return rejectWithValue({
    message: "Network error occured while deleting",
    status: 500,
  });
});

// Interface for jobID generation parameters
interface JobIDGeneration {
  username: string;
  jobID: string;
}

// Error Response interface
interface ErrorResponse {
  message: string;
  status: number;
}

// JobID creation thunk
export const generateJobID = createAsyncThunk<
  { success: boolean },
  JobIDGeneration,
  { rejectValue: ErrorResponse }
>("/jobID/create", async (data: JobIDGeneration, { rejectWithValue }) => {
  try {
    const response = await jobApi.post("/createID", data);
    return { success: response.status === 201 };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let status: number;
      let message: string;

      // Check for MongoDB duplicate key error
      if (error.response?.data?.code === 11000) {
        status = 409;
        message = "Username already exists";
      } else {
        status = error.response?.status || 500;
        message = error.response?.data?.message || "An unknown error occurred";
      }

      return rejectWithValue({
        message,
        status,
      });
    }

    // Handle non-Axios errors
    return rejectWithValue({
      message: "An unexpected error occurred",
      status: 500,
    });
  }
});
//THUNK TO CHECK JOB ID
export const checkJobID = createAsyncThunk<
  { success: boolean },
  { jobID: string },
  { rejectValue: ErrorResponse }
>("jobID/check", async ({ jobID }, { rejectWithValue }) => {
  try {
    const response = await jobApi.get(`/screenID/${jobID}`);

    if (response.status === 200) {
      return { success: true };
    } else if (response.status === 409) {
      return { success: false };
    } else {
      return rejectWithValue({
        message: "Unexpected response status",
        status: response.status,
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return rejectWithValue({
        message: error?.response?.data?.message || "Network or server error",
        status: error?.response?.status || 500,
      });
    return rejectWithValue({
      message: "An unknown error occurred",
      status: 500,
    });
  }
});
//Thunk to delete ID
export const deleteJobID = createAsyncThunk<
  { success: boolean },
  { jobID: string },
  { rejectValue: ErrorResponse }
>("jobID/delete", async ({ jobID }, { rejectWithValue }) => {
  try {
    const response = await jobApi.post(`/deleteID/${jobID}`);

    if (response.status === 200) {
      return { success: true };
    } else if (response.status === 404) {
      return rejectWithValue({
        message: "no such jobID exists",
        status: 404,
      });
    } else {
      return rejectWithValue({
        message: "Unexpected response status",
        status: response.status,
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return rejectWithValue({
        message: error?.response?.data?.message || "Network or server error",
        status: error?.response?.status || 500,
      });

    return rejectWithValue({
      message: "An unknown error occurred",
      status: 500,
    });
  }
});

export const individualJobReducer = individualJobSlice.reducer;
export const allJobsReducer = allJobsSlice.reducer;
