import axios from "axios";

const baseURL = "https://smartboard.thareesha.software/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: ALWAYS attach the token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem("user_data");
    
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user?.id) {
          config.headers["X-User-Id"] = user.id;
        }
      } catch (e) {
        console.error("Failed to parse user_data");
      }
    }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: NO AUTO LOGOUT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // I REMOVED the logic that clears localStorage. 
    // Now, even if there is an error, you stay logged in.
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;