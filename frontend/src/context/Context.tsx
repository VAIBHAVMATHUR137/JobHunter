import { createContext, ReactNode, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Slice/Store";
import axios, { AxiosResponse } from "axios";

interface RecruiterLoginFormData {
 username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
  
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    photo: string;
    username: string;
  };
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  recruiterLoginHandler: () => Promise<AxiosResponse<LoginResponse>>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAccessToken(token);
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
      localStorage.setItem("jobRole", response.data.recruiter.role);
      localStorage.setItem("username", response.data.recruiter.username);
      localStorage.setItem("photo", response.data.recruiter.photo);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
