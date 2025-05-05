import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  designation:string,
  CTC: CTC;
  experience_required_in_months: string;
  isFresherEligible: boolean;
  degree_required: string[];
  bond: string;
  work_environment: WorkEnvironment;
  job_location: string[];
  company_name: string;
  skills_required: string[];
  job_description:string;
  type_of_employment: EmploymentType;
  perks_and_benefits: string;
  required_languages: string[];
  isVisaSponsored: boolean;
  username: string;
  name:string;
  email:string
}
const initialJobPosting: JobPosting = {
  designation:"",
  CTC: initialCTC,
  experience_required_in_months: "",
  isFresherEligible: false,
  degree_required: [],
  bond: "",
  work_environment: initialWorkEnvironment,
  job_location: [],
  company_name: "",
  job_description:"",
  skills_required: [],
  type_of_employment: initialEmploymentType,
  perks_and_benefits: "",
  required_languages: [],
  isVisaSponsored: false,
  username: "",
  name:"",
  email:""
};

export const updateJobPosting = <T extends keyof JobPosting>(
  state: JobPosting,
  action: PayloadAction<{ field: T; value: JobPosting[T] }>
) => {
  const { field, value } = action.payload;
  return {
    ...state,
    [field]: value,
  };
};

export const resetJobPosting = <T extends keyof JobPosting>(
  state: JobPosting,
  action: PayloadAction<{ field: T; value: JobPosting[T] }>
) => {
  return {
    ...state,
    [action.payload.field]: initialJobPosting[action.payload.field],
  };
};

const jobPostingSlice = createSlice({
  name: "jobPostingSlice",
  initialState: initialJobPosting,
  reducers: {
    updateJob: updateJobPosting,
    resetJob: resetJobPosting,
  },
});
export const { updateJob, resetJob } = jobPostingSlice.actions;
export const jobPostingReducer = jobPostingSlice.reducer;
