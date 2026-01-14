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
    // Silently pass errors to be handled by components
    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL };
