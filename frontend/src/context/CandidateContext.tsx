import { ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { candidateLogin, setUsername } from "@/Slice/CandidateThunk";

import { AppDispatch } from "@/Slice/Store";
import { CandidateAuthContext } from "./CreateContext";

interface CandidateLoginResponse {
  accessToken: string;
  refreshToken: string;
  candidate: {
    id: string;
    photo: string;
    username: string;
  };
}
export const CandidateAuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("candidateAccessToken")
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = localStorage.getItem("candidateAccessToken");
    if (token) {
      const username = localStorage.getItem("candidateUsername");
      if (username) dispatch(setUsername(username));
      setAccessToken(token);
    }
  }, [dispatch]);
  const candidateLoginHandler = async (
    username: string,
    password: string
  ): Promise<CandidateLoginResponse> => {
    try {
      const response = await dispatch(
        candidateLogin({ username, password })
      ).unwrap();
      if (response.success) {
        const loginData = response.data;
        setAccessToken(loginData.accessToken);
        localStorage.setItem("candidateAccessToken", loginData.accessToken);
        localStorage.setItem("candidateRefreshToken", loginData.refreshToken);
        localStorage.setItem("candidateUsername", loginData.candidate.username);
        localStorage.setItem("candidatePhoto", loginData.candidate.photo);

        // Update Redux store with username
        dispatch(setUsername(loginData.candidate.username));

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
    localStorage.removeItem("candidateAccessToken");
    localStorage.removeItem("candidateRefreshToken");
    localStorage.removeItem("candidateUsername");
    localStorage.removeItem("candidatePhoto");
    setAccessToken(null);
  };
  const isAuthenticated = !!accessToken;
  return (
    <CandidateAuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        candidateLoginHandler,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </CandidateAuthContext.Provider>
  );
};
export default CandidateAuthProvider;
