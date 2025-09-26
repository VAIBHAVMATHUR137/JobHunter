import axios from "axios";
export const recruiterApi = axios.create({
  baseURL: "https://jobhunter-2-firj.onrender.com/recruiter"
});

// Track the refresh timer so we can clear it on logout
let tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

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
  const accessToken = localStorage.getItem("recruiterAccessToken");
  const refreshToken = localStorage.getItem("recruiterRefreshToken");

  if (!accessToken || !refreshToken) return;
  console.log("access token for recruiter is fetched from local storage")

  const expirationTime = getTokenExpirationTime(accessToken);
  console.log("expiration time is "+ expirationTime)
  const currentTime = Date.now();

  if (expirationTime) {
    const timeLeft = expirationTime - currentTime;
    console.log("Time left is "+ timeLeft)

    // Schedule a refresh slightly before the token expires (30 seconds before expiry)
    const refreshTime = Math.max(timeLeft - 30000, 0); 
    console.log("Refresh time is " + refreshTime);

    // Clear any existing timer
    clearRefreshTimer();

    if (refreshTime > 0) {
      tokenRefreshTimer = setTimeout(async () => {
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
          localStorage.setItem("recruiterAccessToken", newAccessToken);
          localStorage.setItem("recruiterRefreshToken", newRefreshToken);

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

// Function to clear the refresh timer
export const clearRefreshTimer = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
    console.log("Token refresh timer cleared");
  }
};

// Helper function to clear auth data
const clearAuthData = () => {
  console.log("Clear Auth data working.....")
  localStorage.removeItem("recruiterAccessToken");
  localStorage.removeItem("recruiterRefreshToken");
  localStorage.removeItem("recruiterUsername");
  localStorage.removeItem("recruiterPhoto");
  
  // Clear any pending timer
  clearRefreshTimer();
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
    const token = localStorage.getItem("recruiterAccessToken");
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

// Export the important functions
export { clearAuthData, scheduleTokenRefresh };