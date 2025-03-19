import { createContext} from "react";
import { AxiosResponse } from "axios";

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    recruiter: {
      id: string;
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
