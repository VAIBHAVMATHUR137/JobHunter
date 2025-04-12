import { ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsername, recruiterLogin } from "@/Slice/RecruiterThunk";
import { AuthContext } from "./CreateContext";
import { AppDispatch } from "@/Slice/Store";

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
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAccessToken(token);
      const username = localStorage.getItem("username");

      if (username) {
        dispatch(setUsername(username));
        console.log("Username is " + username);
      }
    }
  }, [dispatch]);

  const recruiterLoginHandler = async (username: string, password: string): Promise<LoginResponse> => {
    try {

      const response = await dispatch(recruiterLogin({ username, password })).unwrap();
      
      // If login successful, handle token storage
      if (response.success) {
        const loginData = response.data;
        setAccessToken(loginData.accessToken);
        localStorage.setItem("accessToken", loginData.accessToken);
        localStorage.setItem("refreshToken", loginData.refreshToken);
        localStorage.setItem("username", loginData.recruiter.username);
        localStorage.setItem("photo", loginData.recruiter.photo);
        
        // Update Redux store with username
        dispatch(setUsername(loginData.recruiter.username));
        
        return loginData;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
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