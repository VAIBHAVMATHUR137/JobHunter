import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addAuthHeaderForCandidate, addAuthHeaderForRecruiter, applicationsApi } from "@/API/applicationsAPI";
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

const initialCollegeEducation: CollegeEducation = {
  programme_name: "",
  specialization: "",
  college_name: "",
  university_name: "",
  cgpa: "",
  duration: "",
  year_of_commencement: "",
  year_of_conclusion: "",
};

//Internship Experience
interface InternshipExperience {
  date_of_commencement: string;
  date_of_conclusion: string;
  company: string;
  duration: string;
  roles_and_responsibilities: string;
  stipend: string;
}

const initialInternship: InternshipExperience = {
  date_of_commencement: "",
  date_of_conclusion: "",
  company: "",
  duration: "",
  roles_and_responsibilities: "",
  stipend: "",
};

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
const initial_job_experience: JobExperience = {
  company: "",
  designation: "",
  date_of_commencement: "",
  date_of_resignation: "",
  duration_of_service: "",
  job_description: "",
  annual_ctc: "",
};
//Certificate
interface CertificateCourse {
  platform_name: string;
  mentor_name: string;
  title_of_course: string;
  learning_description: string;
  date_of_commencement: string;
  date_of_conclusion: string;
}
const initialCertificateState: CertificateCourse = {
  platform_name: "",
  mentor_name: "",
  title_of_course: "",
  learning_description: "",
  date_of_commencement: "",
  date_of_conclusion: "",
};
//Current Job
interface CurrentJob {
  company: string;
  job_description: string;
  date_of_commencement: string;
  current_role: string;
  years_of_experience: string;
  current_location: string;
}
const initialCurrentJob: CurrentJob = {
  company: "",
  job_description: "",
  date_of_commencement: "",
  current_role: "",
  years_of_experience: "",
  current_location: "",
};

type Gender = "male" | "female" | "transgender";
const initialGender: Gender = "male";

// Define types for School Education
interface SchoolEducation {
  school_name: string;
  percentage_obtained: string;
  year_of_passing: string;
  school_board: string;
}
const initialSchoolEducation: SchoolEducation = {
  school_name: "",
  percentage_obtained: "",
  year_of_passing: "",
  school_board: "",
};
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

const initialCandidateState: candidateProfile = {
  firstName: "",
  lastName: "",
  title: "",
  one_liner_intro: "",
  number: "",
  email: "",
  username: "",
  password: "",
  gender: initialGender,
  introduction: "",
  photo: "",
  tenth_standard_education: initialSchoolEducation,
  twelth_standard_education: initialSchoolEducation,
  college_education: [initialCollegeEducation],
  internship_experience: [initialInternship],
  work_experience: [initial_job_experience],
  core_skills: [],
  certificate_courses: [initialCertificateState],
  current_job: initialCurrentJob,
};

interface application {
  recruiterUsername?: string;
  jobID:string;
  candidateUsername?:string
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
    const url=data.recruiterUsername?`/screening?jobID=${data.jobID}&recruiterUsername=${data.recruiterUsername}`:`/screening?jobID=${data.jobID}&candidateUsername=${data.candidateUsername}`;
    const response = await applicationsApi.get(url);

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
interface createApplication{
  candidateProfile:candidateProfile;
  recruiterUsername:string;
  job:JobPosting
}
//Candidate can apply for the job using this thunk API
export const createApplicationThunk = createAsyncThunk<
  { success: boolean },
  createApplication,
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

//THIS THUNK IS THERE TO DISPLAY ALL THE JOBS WHERE EACH CANDIDATE HAS APPLIED
export const candidateJobApplicationThunk = createAsyncThunk<
  JobPosting[],
  { candidateUsername: string },
  { rejectValue: ErrorResponse }
>(
  "candidate/AllJobsApplied",
  async (candidateUsername, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.get(
        `/jobStatus?candidateUsername=${candidateUsername.candidateUsername}`,addAuthHeaderForCandidate()
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

//THIS SLICE IS THERE TO RENDER THE LIST OF ALL THE CANDIDATES WHO APPLIED FOR A JOB
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

//THIS THUNK IS THERE TO RENDER THE LIST OF ALL JOBS WHICH A PARTICULAR RECRUITER POSTED
export const recruiterJobListingThunk = createAsyncThunk<
  JobPosting[],
  { recruiterUsername: string },
  { rejectValue: ErrorResponse }
>(
  "recruiter/allRecruitments",
  async (recruiterUsername, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.get(
        `/jobStatus?recruiterUsername=${recruiterUsername.recruiterUsername}`,addAuthHeaderForRecruiter()
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

//THUNK WHICH IS USED BY RECRUITER TO GET LIST OF CANDIDATES WHO APPLIED FOR A PARTICULAR JOB
export const jobApplicantsThunk = createAsyncThunk<
  candidateProfile[],
  { recruiterUsername: string; jobID: string },
  { rejectValue: ErrorResponse }
>("/recruitment/applicants", async (data, { rejectWithValue }) => {
  try {
    const response = await applicationsApi.get(
      `/jobStatus?recruiterUsername=${data.recruiterUsername}&jobID=${data.jobID}`,addAuthHeaderForRecruiter()
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
        message: error.response?.data?.message || "Failed to fetch job details",
        status: error.response?.status || 500,
      });
    }
  }
  return {
    message: "Unexpected error from the backend",
    status: 500,
  };
});

interface fetchAllApplicants {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  applicant: candidateProfile[];
}

const initialApplicantState: fetchAllApplicants = {
  isLoading: false,
  error: null,
  isSuccess: true,
  applicant: [initialCandidateState],
};

export const jobApplicantsSlice = createSlice({
  name: "jobApplicantSlice",
  initialState: initialApplicantState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(jobApplicantsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(jobApplicantsThunk.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.applicant= action.payload;
      })
      .addCase(jobApplicantsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch recruitment details";
        state.isSuccess = false;
        state.applicant = [initialCandidateState];
      });
  },
});

export const allAppliedJobs = allJobsAppliedSlice.reducer;
export const allRecruitments = allRecruitmentSlice.reducer;
export const allApplicants=jobApplicantsSlice.reducer