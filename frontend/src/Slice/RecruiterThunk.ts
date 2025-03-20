import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { recruiterApi } from "@/API/recruiterApi";
import { recruiterRegistrationReset } from "./RecruiterStateSlice";
import { createSlice } from "@reduxjs/toolkit";
// Types
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
    id: string;
    photo: string;
    username: string;
  };
}
interface UsernameRequest {
  username: string;
  password: string;
}
interface RecruiterFormData {
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
  tenth_standard_education: {
    school_name: string;
    percentage_obtained: string;
    year_of_passing: string;
    school_board: string;
  };
  twelth_standard_education: {
    school_name: string;
    percentage_obtained: string;
    year_of_passing: string;
    school_board: string;
  };
  college_education: Array<{
    programme_name: string;
    specialization: string;
    college_name: string;
    university_name: string;
    cgpa: string;
    duration: string;
    year_of_commencement: string;
    year_of_conclusion: string;
  }>;
  internship_experience: Array<{
    date_of_commencement: string;
    date_of_conclusion: string;
    company: string;
    duration: string;
    roles_and_responsibilities: string;
    stipend: string;
  }>;
  work_experience: Array<{
    company: string;
    designation: string;
    date_of_commencement: string;
    date_of_resignation: string;
    duration_of_service: string;
    job_description: string;
    annual_ctc: string;
  }>;
  core_skills: string[];
  certificate_courses: Array<{
    platform_name: string;
    mentor_name: string;
    title_of_course: string;
    learning_description: string;
    date_of_commencement: string;
    date_of_conclusion: string;
  }>;
  current_job: {
    company: string;
    job_description: string;
    date_of_commencement: string;
    current_role: string;
    years_of_experience: string;
    current_location: string;
  };
}

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
  "recruiter/checkUsernameAvailability",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.post("/username/check", {
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
export const checkUsername = createAsyncThunk<
  { success: boolean },
  UsernameRequest,
  { rejectValue: ErrorResponse }
>("recruiter/checkUsername", async (data, { rejectWithValue }) => {
  try {
    const response = await recruiterApi.post("/username/create", data);
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

// Thunk for recruiter registration
export const recruiterRegistration = createAsyncThunk<
  { success: boolean; data: RecruiterFormData },
  RecruiterFormData,
  { rejectValue: ErrorResponse }
>("recruiter/register", async (formData, { dispatch, rejectWithValue }) => {
  try {
    const userNameCheck = await dispatch(
      checkUsername({
        username: formData.username,
        password: formData.password,
      })
    ).unwrap();
    if (!userNameCheck.success) {
      return rejectWithValue({
        message: "Username is already taken",
        status: 409,
      });
    }
    //username stage verified, procees with registration
    const response = await recruiterApi.post("/createRecruiter", formData);
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
        dispatch(recruiterRegistrationReset({ field }));
      });
      return {
        success: true,
        data: response.data,
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
          message = "Recruiter with same email or cell number already exists";
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

export const loginRecruiter = createAsyncThunk<
  { success: boolean; data: LoginResponse },
  LoginCredentials,
  { rejectValue: ErrorResponse }
>("recruiter/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await recruiterApi.post("/login", credentials);
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
export const fetchRecruiterDetails = createAsyncThunk<
  RecruiterFormData,
  { username: string },
  { rejectValue: { message: string; status: number } }
>("recruiter/fetchDetails", async ({ username }, { rejectWithValue }) => {
  try {
    const response = await recruiterApi.get(`/fetchRecruiter/${username}`);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({
      message: "Failed to fetch recruiter details",
      status: response.status,
    });
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
interface RecruiterApiState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isAuthenticated: boolean;
  recruiterData: any;
  username: string | null;
  usernameAvailable: boolean | null;
  usernameMessage: string;
}

const initialState: RecruiterApiState = {
  isLoading: false,
  error: null,
  isSuccess: false,
  isAuthenticated: false,
  recruiterData: null,
  username: null,
  usernameAvailable: null,
  usernameMessage: "",
};
const recruiterApiSlice = createSlice({
  name: "recruiterApi",
  initialState,
  reducers: {
    resetApiState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.recruiterData = null;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Username at the time of registration
    builder
      .addCase(checkUsername.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUsername.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Username check failed";
      });
    //Verify if no same username exists in database
    builder
      .addCase(checkUsernameAvailability.fulfilled, (state, action) => {
        state.usernameAvailable = true;
        state.usernameMessage = action.payload?.message;
      })
      .addCase(checkUsernameAvailability.rejected, (state, action) => {
        state.usernameAvailable = false;
        state.usernameMessage = action.payload as string;
      });

    // Handle recruiter registration
    builder
      .addCase(recruiterRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(recruiterRegistration.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(recruiterRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
        state.isSuccess = false;
      });

    // Handle recruiter login
    builder
      .addCase(loginRecruiter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginRecruiter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.recruiterData = action.payload.data;
        state.username = action.payload.data.recruiter.username;
        state.error = null;
      })
      .addCase(loginRecruiter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
      });
    //handle recruiter data fetching
    builder
      .addCase(fetchRecruiterDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(fetchRecruiterDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recruiterData = action.payload;
        state.username = action.payload.username;
        state.error = null;
      })
      .addCase(fetchRecruiterDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch recruiter details";
        state.isSuccess = false;
        state.recruiterData = null;
      });
  },
});
export const { resetApiState, logout, setUsername } = recruiterApiSlice.actions;
export default recruiterApiSlice.reducer;