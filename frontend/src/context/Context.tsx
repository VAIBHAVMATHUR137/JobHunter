import { createContext, ReactNode, useState, useEffect } from "react";
import {  useDispatch } from "react-redux";

import { setUsername } from "@/Slice/RecruiterThunk";
import api from "@/api";
import { AxiosResponse } from "axios";




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
  recruiterLoginHandler: (username: string, password: string) => Promise<AxiosResponse<LoginResponse>>;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    if (token) {
      setAccessToken(token);
      
      // If username exists in localStorage, update Redux store
      if (username) {
        dispatch(setUsername(username));
      }
    }
  }, [dispatch]);

  const recruiterLoginHandler = async (username: string, password: string) => {
    const response = await api.post<LoginResponse>("/recruiter/login", { username, password });

    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("jobRole", response.data.recruiter.role);
      localStorage.setItem("username", response.data.recruiter.username);
      localStorage.setItem("photo", response.data.recruiter.photo);
      
      // Update Redux store with username
      dispatch(setUsername(response.data.recruiter.username));
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("jobRole");
    localStorage.removeItem("username");
    localStorage.removeItem("photo");
    setAccessToken(null);
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        recruiterLoginHandler,
        isAuthenticated,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;