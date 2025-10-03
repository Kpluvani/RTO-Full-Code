import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // baseURL: "https://rtoapi.vruttiitsolutions.com/api",
  // baseURL: "https://n1lsdhx1-5000.inc1.devtunnels.ms/api",
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json'
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          if (error.response.data?.error?.message?.includes("jwt expired") || error.response.data?.error?.includes("jwt expired")) {
            localStorage.removeItem("token");
            localStorage.removeItem("isAdmin");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export default axiosInstance;
