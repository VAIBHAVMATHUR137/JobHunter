import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Function to decode the token and extract expiration time
const getTokenExpirationTime = (token: string): number | null => {
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
  return payload.exp * 1000; // Convert to milliseconds
};

// Function to schedule token refresh
const scheduleTokenRefresh = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) return;

  const expirationTime = getTokenExpirationTime(accessToken);
  const currentTime = Date.now();

  if (expirationTime) {
    const timeLeft = expirationTime - currentTime;

    // Schedule a refresh slightly before the token expires
    const refreshTime = timeLeft - 60000; // Refresh 1 minute before expiry

    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/recruiter/refresh-token",
            {
              refreshToken,
            }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          // Store the new tokens
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Reschedule the next refresh
          scheduleTokenRefresh();
        } catch (error) {
          console.error("Failed to refresh token:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/RecruiterLogin";
        }
      }, refreshTime);
    }
  }
};

// Schedule refresh when the app starts
scheduleTokenRefresh();

// Axios Request Interceptor
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          "http://localhost:5000/recruiter/refresh-token",
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/RecruiterLogin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
