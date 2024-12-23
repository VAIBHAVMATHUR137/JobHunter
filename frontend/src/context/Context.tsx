import { createContext, ReactNode, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Slice/Store";
import axios, { AxiosResponse } from "axios";

interface RecruiterLoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
    email: string;
    id: string;
    role: string;
  };
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  recruiterLoginHandler: () => Promise<AxiosResponse<LoginResponse>>;
  isAuthenticated: boolean;
  recruiterEmail: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [recruiterEmail, setRecruiterEmail] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("recruiterEmail"); 
    if (token) {
      setAccessToken(token);
    }
    if (email) {
      setRecruiterEmail(email);
    }
  }, []);

  const recruiterLoginFormData = useSelector<RootState, RecruiterLoginFormData>(
    (state) => state.recruiterLogin
  );

  const recruiterLoginHandler = async (): Promise<
    AxiosResponse<LoginResponse>
  > => {
    const response = await axios.post<LoginResponse>(
      "http://localhost:5000/recruiter/login",
      recruiterLoginFormData
    );

    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setRecruiterEmail(response.data.recruiter.email);
      if (recruiterEmail) {
        localStorage.setItem("Recruiter Email Address", recruiterEmail);
      }
    }

    return response;
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        recruiterLoginHandler,
        isAuthenticated,
        recruiterEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;