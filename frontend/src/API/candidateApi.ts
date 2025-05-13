import axios from "axios";
export const candidateApi = axios.create({
  baseURL: "http://localhost:5000/candidate",
});

// Function to decode the token and extract expiration time
const getTokenExpirationTime = (token: string): number | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Function to schedule token refresh
const scheduleTokenRefresh = () => {
  console.log("schedule token refresh working...");
  const accessToken = localStorage.getItem("candidateAccessToken");
  const refreshToken = localStorage.getItem("candidateRefreshToken");

  if (!accessToken || !refreshToken) return;

  console.log("access token for candidate is fetched from local storage")
  const expirationTime = getTokenExpirationTime(accessToken);
  console.log("expiration time is "+ expirationTime)
  const currentTime = Date.now();

  if (expirationTime) {
    const timeLeft = expirationTime - currentTime;
    console.log("Time left is " + timeLeft);

    // Schedule a refresh slightly before the token expires (30 seconds before expiry)
    const refreshTime = Math.max(timeLeft - 30000, 0);
    console.log("Refresh time is " + refreshTime);
    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          const response = await candidateApi.post(`/refresh-token`, {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;
          console.log({
            "New Access Token": newAccessToken,
            "New Refresh Token": newRefreshToken,
          });
          // Store the new tokens
          localStorage.setItem("candidateAccessToken", newAccessToken);
          localStorage.setItem("candidateRefreshToken", newRefreshToken);

          // Reschedule the next refresh
          scheduleTokenRefresh();
        } catch (error) {
          console.error("Failed to refresh token:", error);
          clearAuthData();
          window.location.href = "/CandidateLogin";
        }
      }, refreshTime);
    } else {
      // Token is already expired or about to expire, refresh immediately
      refreshTokenAsync(refreshToken).catch(() => {
        clearAuthData();
        window.location.href = "/CandidateLogin";
      });
    }
  }
};

// Helper function to clear auth data
const clearAuthData = () => {
  console.log("Clear Auth data working.....");
  localStorage.removeItem("candidateAccessToken");
  localStorage.removeItem("candidateRefreshToken");
  localStorage.removeItem("candidateUsername");
  localStorage.removeItem("candidatePhoto");
};

// Function to refresh token asynchronously
const refreshTokenAsync = async (refreshToken: string) => {
  console.log("Starting function refreshTokenAsync....");
  const response = await candidateApi.post("/refresh-token", { refreshToken });

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  console.log({
    "new access token": accessToken,
    "new refresh token": newRefreshToken,
  });

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
};

// Initialize token refresh on script load
scheduleTokenRefresh();

// Axios Request Interceptor
candidateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("candidateAccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor
candidateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("candidateRefreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { accessToken } = await refreshTokenAsync(refreshToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return candidateApi(originalRequest);
      } catch (refreshError) {
        clearAuthData();
        window.location.href = "/CandidateLogin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
