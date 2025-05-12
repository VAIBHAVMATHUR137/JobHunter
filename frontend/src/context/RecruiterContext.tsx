import { ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsername, recruiterLogin, recruiterLogout, recruiterDashboard } from "@/Slice/RecruiterThunk";
import { RecruiterAuthContext } from "./CreateContext";
import { AppDispatch } from "@/Slice/Store";
import { clearRefreshTimer } from "../API/recruiterApi" // Import the function to clear the timer

interface RecruiterLoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
    id: string;
    photo: string;
    username: string;
  };
}

export const RecruiterAuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("recruiterAccessToken")
  );
  const dispatch = useDispatch<AppDispatch>();


  const username = localStorage.getItem("recruiterUsername");
  useEffect(() => {
    const token = localStorage.getItem("recruiterAccessToken");

    if (token) {
      setAccessToken(token);
      const username = localStorage.getItem("recruiterUsername");

      if (username) {
        dispatch(recruiterDashboard({username}));
        console.log("Username is " + username);
      }
    }
  }, [dispatch]);

  const recruiterLoginHandler = async (
    username: string,
    password: string
  ): Promise<RecruiterLoginResponse> => {
    try {
      const response = await dispatch(
        recruiterLogin({ username, password })
      ).unwrap();

      // If login successful, handle token storage
      if (response.success) {
        const loginData = response.data;
        setAccessToken(loginData.accessToken);
        localStorage.setItem("recruiterAccessToken", loginData.accessToken);
        localStorage.setItem("recruiterRefreshToken", loginData.refreshToken);
        localStorage.setItem("recruiterUsername", loginData.recruiter.username);
        localStorage.setItem("recruiterPhoto", loginData.recruiter.photo);

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
    // Clear the refresh timer to prevent token regeneration
    clearRefreshTimer();
    
    // Dispatch logout action if username exists
    if(username) {
      dispatch(recruiterLogout(username));
    }
    
    // Clear localStorage
    localStorage.removeItem("recruiterAccessToken");
    localStorage.removeItem("recruiterRefreshToken");
    localStorage.removeItem("recruiterUsername");
    localStorage.removeItem("recruiterPhoto");
    
    // Update state
    setAccessToken(null);
  };

  const isAuthenticated = !!accessToken;

  return (
    <RecruiterAuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        recruiterLoginHandler,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </RecruiterAuthContext.Provider>
  );
};

export default RecruiterAuthProvider;