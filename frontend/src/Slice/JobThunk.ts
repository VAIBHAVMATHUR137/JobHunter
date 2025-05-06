import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const jobApi = axios.create({
  baseURL: "http://localhost:5000/job",
});
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
};

//FETCH INDIVIDUAL JOB
export const fetchIndividualJob = createAsyncThunk<
  JobPosting,
  { id: string },
  { rejectValue: { message: string; status: number } }
>("/job/fetchIndividual", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await jobApi.get(`/fetchIndividualJob/${id}`);
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
  void,
  { rejectValue: { message: string; status: number } }
>("job/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await jobApi.get("/fetch");
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

export const individualJobReducer = individualJobSlice.reducer;
export const allJobsReducer=allJobsSlice.reducer;
