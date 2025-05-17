import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { applicationsApi } from "@/API/applicationsAPI";
import axios from "axios";

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
interface SchoolEducation {
  school_name: string;
  percentage_obtained: string;
  year_of_passing: string;
  school_board: string;
}
type Gender = "male" | "female" | "transgender";
//College Education
interface CollegeEducation {
  programme_name: string;
  specialization: string;
  college_name: string;
  university_name: string;
  cgpa: string;
  duration: string;
  year_of_commencement: string;
  year_of_conclusion: string;
}
//Internship Experience
interface InternshipExperience {
  date_of_commencement: string;
  date_of_conclusion: string;
  company: string;
  duration: string;
  roles_and_responsibilities: string;
  stipend: string;
}
//Job Experience
interface JobExperience {
  company: string;
  designation: string;
  date_of_commencement: string;
  date_of_resignation: string;
  duration_of_service: string;
  job_description: string;
  annual_ctc: string;
}
//Certificate
interface CertificateCourse {
  platform_name: string;
  mentor_name: string;
  title_of_course: string;
  learning_description: string;
  date_of_commencement: string;
  date_of_conclusion: string;
}
//Current Job
interface CurrentJob {
  company: string;
  job_description: string;
  date_of_commencement: string;
  current_role: string;
  years_of_experience: string;
  current_location: string;
}
//interface for first time registration/signin by the candidate
interface candidateProfile {
  firstName: string;
  lastName: string;
  title: string;
  one_liner_intro: string;
  number: string;
  email: string;
  username: string;
  password: string;
  gender: Gender;
  introduction: string;
  photo: string;
  tenth_standard_education: SchoolEducation;
  twelth_standard_education: SchoolEducation;
  college_education: CollegeEducation[];
  internship_experience: InternshipExperience[];
  work_experience: JobExperience[];
  core_skills: string[];
  certificate_courses: CertificateCourse[];
  current_job: CurrentJob;
}
interface application {
  recruiterUsername?: string;
  job: JobPosting;
  candidateProfile: candidateProfile;
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

export const candidateJobApplicationThunk = createAsyncThunk<
  JobPosting[],
  { candidateUsername: string },
  { rejectValue: ErrorResponse }
>(
  "candidate/AllJobsApplied",
  async (candidateUsername, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.get(
        `/jobStatus?candidateUsername=${candidateUsername.candidateUsername}`
      );
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
          message:
            error.response?.data?.message || "Failed to fetch job details",
          status: error.response?.status || 500,
        });
      }
    }
    return {
      message: "Unexpected error from the backend",
      status: 500,
    };
  }
);
interface fetchAppliedJobs {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  jobData: JobPosting[];
}

const initialAppliedJobsState: fetchAppliedJobs = {
  isLoading: false,
  error: null,
  isSuccess: true,
  jobData: [initialJobPosting],
};

export const allJobsAppliedSlice = createSlice({
  name: "allJobsAppliedSlice",
  initialState: initialAppliedJobsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(candidateJobApplicationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(candidateJobApplicationThunk.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.jobData = action.payload;
      })
      .addCase(candidateJobApplicationThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch candidate details";
        state.isSuccess = false;
        state.jobData = [initialJobPosting];
      });
  },
});

export const recruiterJobListingThunk = createAsyncThunk<
  JobPosting[],
  { recruiterUsername: string },
  { rejectValue: ErrorResponse }
>(
  "recruiter/allRecruitments",
  async (recruiterUsername, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.get(
        `/jobStatus?recruiterUsername=${recruiterUsername.recruiterUsername}`
      );
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
          message:
            error.response?.data?.message || "Failed to fetch job details",
          status: error.response?.status || 500,
        });
      }
    }
    return {
      message: "Unexpected error from the backend",
      status: 500,
    };
  }
);

interface fetchAllRecruitments {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  recruitment: JobPosting[];
}

const initialRecruitmentState: fetchAllRecruitments = {
  isLoading: false,
  error: null,
  isSuccess: true,
  recruitment: [initialJobPosting],
};

export const allRecruitmentSlice = createSlice({
  name: "allRecruitmentSlice",
  initialState: initialRecruitmentState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recruiterJobListingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(recruiterJobListingThunk.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.recruitment = action.payload;
      })
      .addCase(recruiterJobListingThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch recruitment details";
        state.isSuccess = false;
        state.recruitment = [initialJobPosting];
      });
  },
});

export const allAppliedJobs = allJobsAppliedSlice.reducer;
export const allRecruitments = allRecruitmentSlice.reducer;
