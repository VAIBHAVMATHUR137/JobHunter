import { createContext } from "react";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  recruiter: {
    id: string;
    photo: string;
    username: string;
  };
}

// Changed the return type to be more flexible
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  recruiterLoginHandler: (
    username: string,
    password: string
  ) => Promise<LoginResponse>;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
