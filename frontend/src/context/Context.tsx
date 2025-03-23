import { ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserName } from "@/Slice/RecruiterThunk";
import { recruiterApi } from "@/API/recruiterApi";
import { AuthContext } from "./CreateContext";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
    id: string;
    photo: string;
    username: string;
  };
}

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
        dispatch(setUserName(username));
      }
    }
  }, [dispatch]);

  const recruiterLoginHandler = async (username: string, password: string) => {
    const response = await recruiterApi.post<LoginResponse>("/login", {
      username,
      password,
    });

    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("username", response.data.recruiter.username);
      localStorage.setItem("photo", response.data.recruiter.photo);
      // Update Redux store with username
      dispatch(setUserName(response.data.recruiter.username));
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
