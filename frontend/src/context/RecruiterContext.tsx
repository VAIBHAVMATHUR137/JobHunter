import { ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsername, recruiterLogin } from "@/Slice/RecruiterThunk";
import { RecruiterAuthContext } from "./CreateContext";
import { AppDispatch } from "@/Slice/Store";

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

  useEffect(() => {
    const token = localStorage.getItem("recruiterAccessToken");

    if (token) {
      setAccessToken(token);
      const username = localStorage.getItem("recruiterUsername");

      if (username) {
        dispatch(setUsername(username));
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
    localStorage.removeItem("recruiterAccessToken");
    localStorage.removeItem("recruiterRefreshToken");
    localStorage.removeItem("recruiterUsername");
    localStorage.removeItem("recruiterPhoto");
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
