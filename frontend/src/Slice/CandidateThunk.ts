import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { candidateApi } from "@/API/candidateApi";
import { candidateRegistrationReset } from "./CandidateStateSlice";
import { createSlice } from "@reduxjs/toolkit";

// Types
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  candidate: {
    id: string;
    photo: string;
    username: string;
  };
}
const initialLoginResponse: LoginResponse = {
  accessToken: "",
  refreshToken: "",
  candidate: {
    id: "",
    photo: "",
    username: "",
  },
};
interface UsernameRequest {
  username: string;
  password: string;
}

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

//College education
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

interface CandidateFormData {
  firstName: string;
  lastName: string;
  title: string;
  one_liner_intro: string;
  email: string;
  password: string;
  username: string;
  gender: "male" | "female" | "transgender";
  introduction: string;
  number: string;
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

const initialCandidateFormData: CandidateFormData = {
  firstName: "",
  lastName: "",
  title: "",
  one_liner_intro: "",
  number: "",
  email: "",
  username: "",
  password: "",
  gender: "male",
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

interface LoginCredentials {
  username: string;
  password: string;
}

// Error Responses
interface ErrorResponse {
  message: string;
  status: number;
}
//Thunk to check username in database
export const checkUsernameAvailability = createAsyncThunk(
  "candidate/checkUsernameAvailability",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await candidateApi.post("/username/check", {
        username,
      });
      if (response.status === 200) {
        return { available: true, message: "Username Available" };
      } else {
        return rejectWithValue("Unexpected response status");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return rejectWithValue("Username Unavailable");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

//Thunk to generate username
export const generateUsername = createAsyncThunk<
  { success: boolean },
  UsernameRequest,
  { rejectValue: ErrorResponse }
>("candidate/checkUsername", async (data, { rejectWithValue }) => {
  try {
    const response = await candidateApi.post("/username/create", data);
    return { success: response.status === 201 };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let status: number;
      let message: string;
      if (error.response?.status === 409) {
        status = 409;
        message = "Username already exists";
      } else {
        status = error.response?.status || 500;
        message = error.response?.data?.message;
      }
      return rejectWithValue({
        message,
        status,
      });
    }
  }
  return rejectWithValue({ message: "Unknown error occured", status: 500 });
});

//Slice for username generation
interface usernameGenerator {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}
const initialUsernameGeneratorState: usernameGenerator = {
  isLoading: false,
  error: null,
  isSuccess: false,
};
export const candidateUsernameGeneratorSlice = createSlice({
  name: "candidaterUsernameRegistrationSlice",
  initialState: initialUsernameGeneratorState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateUsername.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(generateUsername.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.isSuccess = true;
      })
      .addCase(generateUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Username check failed";
        state.isSuccess = false;
      });
  },
});

//THUNK FOR CANDIDATE REGISTRATION
export const candidateRegistration = createAsyncThunk<
  { success: boolean },
  CandidateFormData,
  { rejectValue: ErrorResponse }
>("candidate/register", async (formData, { dispatch, rejectWithValue }) => {
  try {
    const usernameGenerate = await dispatch(
      generateUsername({
        username: formData.username,
        password: formData.password,
      })
    ).unwrap();
    if (!usernameGenerate.success) {
      return rejectWithValue({
        message: "Username is already taken",
        status: 409,
      });
    }
    //username stage verified, proceed with registration
    const response = await candidateApi.post("/create", formData);
    //registration successful
    if (response.status === 201) {
      //RESET form on successful registration
      const resetFields = [
        "firstName",
        "lastName",
        "title",
        "one_liner_intro",
        "email",
        "password",
        "username",
        "gender",
        "introduction",
        "number",
        "tenth_standard_education",
        "twelth_standard_education",
        "college_education",
        "core_skills",
        "internship_experience",
        "certificate_courses",
        "work_experience",
        "current_job",
      ] as const;
      resetFields.forEach((field) => {
        dispatch(candidateRegistrationReset({ field }));
      });
      return {
        success: true,
      };
    }
    return rejectWithValue({
      message: "Registration failed",
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      let message = "Unknown error occured";
      switch (status) {
        case 409:
          message = "Candidate with same email or cell number already exists";
          break;
        case 400:
          message = "Invalid data provided, please check your data";
          break;
        default:
          message = error.response?.data?.message || "Registration failed";
      }

      return rejectWithValue({
        message,
        status: status || 500,
      });
    }
  }
  return rejectWithValue({
    message: "An unknown error occured",
    status: 500,
  });
});

//Thunk for candidate login
export const candidateLogin = createAsyncThunk<
  { success: boolean; data: LoginResponse },
  LoginCredentials,
  { rejectValue: ErrorResponse }
>("candidate/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await candidateApi.post("/login", credentials);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message || "Login Failed",
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: "Unknown error occured",
      status: 500,
    });
  }
});

interface candidateLogin {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isAuthenticated: boolean;
  postLoginResponse: LoginResponse | string;
  username: string;
}

const initialCandidateLogin: candidateLogin = {
  isLoading: false,
  error: null,
  isSuccess: false,
  isAuthenticated: false,
  postLoginResponse: initialLoginResponse,
  username: "",
};

const candidateLoginSlice = createSlice({
  name: "candidateLoginSlice",
  initialState: initialCandidateLogin,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(candidateLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(candidateLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.isSuccess = true;
        state.postLoginResponse = action.payload.data;
        state.username = action.payload.data.candidate.username;
      })
      .addCase(candidateLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
        state.isSuccess = false;
      });
  },
});

export const fetchCandidateDetails = createAsyncThunk<
  CandidateFormData,
  { username: string },
  { rejectValue: { message: string; status: number } }
>("candidate/fetchDetails", async ({ username }, { rejectWithValue }) => {
  try {
    const response = await candidateApi.get(`/fetch/${username}`);

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

    return rejectWithValue({
      message: "An unknown error occurred",
      status: 500,
    });
  }
});
interface fetchCandidate {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  candidateData: CandidateFormData;
  username: string;
}
const initialCandidateState: fetchCandidate = {
  error: null,
  isLoading: false,
  isSuccess: false,
  candidateData: initialCandidateFormData,
  username: "",
};

export const candidateProfileSlice = createSlice({
  name: "candidateProfileSlice",
  initialState: initialCandidateState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateDetails.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.candidateData = action.payload;
        state.username = action.payload.username;
      })
      .addCase(fetchCandidateDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch candidate details";
        state.isSuccess = false;
        state.candidateData = initialCandidateFormData;
        state.username = "";
      });
  },
});
export const deleteCandidate = createAsyncThunk<
  boolean,
  { username: string },
  { rejectValue: ErrorResponse }
>("candidate/delete", async (data, { rejectWithValue }) => {
  try {
    const response = await candidateApi.delete(`/delete/${data.username}`);

    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      // Return the error message from the server
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete candidate",
        status: 500,
      });
    }
  }
  return rejectWithValue({
    message: "Network error occured while deleting the candidate",
    status: 500,
  });
});

export const candidateLogout = createAsyncThunk<
  boolean,
  string,
  { rejectValue: ErrorResponse }
>("candidate/logout", async (username: string, { rejectWithValue }) => {
  try {
    const response = await candidateApi.post("/logout", { username });
    if (response.status === 200) {
      console.log("Logout successful");

      return response.data.message;
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return rejectWithValue({
        message:
          error.response?.data?.message || "Cannot perform logout operation",
        status: error.status || 500,
      });
  }
});

//Thunk to fetch all candidates
export const fetchAllCandidates = createAsyncThunk<
  CandidateFormData[],
  void,
  { rejectValue: { message: string; status: number } }
>("candidate/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await candidateApi.get("/fetchAll");

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

interface fetchAllCandidates {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  candidateData: CandidateFormData[];
}
const initialAllCandidatesState: fetchAllCandidates = {
  isLoading: false,
  error: null,
  isSuccess: false,
  candidateData: [initialCandidateFormData],
};

export const allCandidatesSlice = createSlice({
  name: "allCandidatesSlice",
  initialState: initialAllCandidatesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCandidates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCandidates.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.candidateData = action.payload;
      })
      .addCase(fetchAllCandidates.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch candidate details";
        state.isSuccess = false;
        state.candidateData = [initialCandidateFormData];
      });
  },
});
export const candidateDashboard = createAsyncThunk<
  CandidateFormData,
  { username: string },
  { rejectValue: { message: string; status: number } }
>("candidate/dashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await candidateApi.get("/dashboard");
    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue({
        message: "Failed to fetch recruiter details",
        status: response.status,
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch recruiter details",
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred",
      status: 500,
    });
  }
});
interface candidateDashboardInterface {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  candidateData: CandidateFormData;
  username: string;
}
const initialDashboardState: candidateDashboardInterface = {
  isLoading: false,
  error: null,
  isSuccess: false,
  candidateData: initialCandidateFormData,
  username: "",
};
export const candidateDashboardSlice = createSlice({
  name: "candidateDashboardSlice",
  initialState: initialDashboardState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(candidateDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(candidateDashboard.fulfilled, (state, action) => {
        state.error = null;
        state.isSuccess = true;
        state.isLoading = false;
        state.candidateData = action.payload;
        state.username = action.payload.username;
      })
      .addCase(candidateDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch recruiter details";
        state.isSuccess = false;
        state.candidateData = initialCandidateFormData;
        state.username = "";
      });
  },
});
export const candidateUsernameGeneratorReducer =
  candidateUsernameGeneratorSlice.reducer;

export const { setUsername } = candidateLoginSlice.actions;
export const candidate_login_reducer = candidateLoginSlice.reducer;
export const get_all_candidates = allCandidatesSlice.reducer;
export const get_candidate_profile = candidateProfileSlice.reducer;
export const candidateDashboardReducer = candidateDashboardSlice.reducer;
