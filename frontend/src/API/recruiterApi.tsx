import axios from "axios";
export const recruiterApi = axios.create({
  baseURL: "http://localhost:5000/recruiter"
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
  console.log("schedule token refresh working.....")
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) return;

  const expirationTime = getTokenExpirationTime(accessToken);
  const currentTime = Date.now();

  if (expirationTime) {
    const timeLeft = expirationTime - currentTime;
    console.log("Time left is "+ timeLeft)

    // Schedule a refresh slightly before the token expires (30 seconds before expiry)
    const refreshTime = Math.max(timeLeft - 30000, 0); 

    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          const response = await recruiterApi.post(
            `/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          console.log({
            "New Access Token":newAccessToken,
            "New Refresh Token":newRefreshToken
          })
          // Store the new tokens
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Reschedule the next refresh
          scheduleTokenRefresh();
        } catch (error) {
          console.error("Failed to refresh token:", error);
          clearAuthData();
          window.location.href = "/RecruiterLogin";
        }
      }, refreshTime);
    } else {
      // Token is already expired or about to expire, refresh immediately
      refreshTokenAsync(refreshToken).catch(() => {
        clearAuthData();
        window.location.href = "/RecruiterLogin";
      });
    }
  }
};

// Helper function to clear auth data
const clearAuthData = () => {
  console.log("Clear Auth data working.....")
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("jobRole");
  localStorage.removeItem("username");
  localStorage.removeItem("photo");
};

// Function to refresh token asynchronously
const refreshTokenAsync = async (refreshToken: string) => {
  console.log("Starting function refreshTokenAsync....")
  const response = await recruiterApi.post(
    "/refresh-token",
    { refreshToken }
  );
  
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  console.log({
    "new access token":accessToken,
    "new refresh token":newRefreshToken
  })
  
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);
  
  return { accessToken, refreshToken: newRefreshToken };
};

// Initialize token refresh on script load
scheduleTokenRefresh();

// Axios Request Interceptor
recruiterApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor
recruiterApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { accessToken } = await refreshTokenAsync(refreshToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return recruiterApi(originalRequest);
      } catch (refreshError) {
        clearAuthData();
        window.location.href = "/RecruiterLogin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

