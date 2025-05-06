import { createContext } from "react";

interface RecruiterLoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
    id: string;
    photo: string;
    username: string;
  };
}

interface CandidateLoginResponse {
  accessToken: string;
  refreshToken: string;
  candidate: {
    id: string;
    photo: string;
    username: string;
  };
}

interface RecruiterAuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  recruiterLoginHandler: (
    username: string,
    password: string
  ) => Promise<RecruiterLoginResponse>;
  isAuthenticated: boolean;
  logout: () => void;

}

interface CandidateAuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  candidateLoginHandler: (
    username: string,
    password: string
  ) => Promise<CandidateLoginResponse>;
  isAuthenticated: boolean;
  logout: () => void;
}
export const RecruiterAuthContext = createContext<
  RecruiterAuthContextType | undefined
>(undefined);

export const CandidateAuthContext = createContext<
  CandidateAuthContextType | undefined
>(undefined);
