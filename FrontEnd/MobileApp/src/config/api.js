import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use the production API base URL (same as website)
const API_BASE_URL = "https://pcbuilder.runasp.net/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type to application/json if it's not FormData
    // FormData needs to set its own Content-Type with boundary
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL };
