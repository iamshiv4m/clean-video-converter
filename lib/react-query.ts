import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Request interceptor
export const requestInterceptor = async (config: any) => {
  // You can add auth token here
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

// Response interceptor
export const responseInterceptor = async (response: any) => {
  // Handle successful responses
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // Handle different error status codes
  /*   switch (response.status) {
    case 401:
      // Handle unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login";
      break;
    case 403:
      // Handle forbidden
      console.error("Access forbidden");
      break;
    case 404:
      // Handle not found
      console.error("Resource not found");
      break;
    case 500:
      // Handle server error
      console.error("Server error");
      break;
    default:
      console.error("An error occurred");
  } */

  return Promise.reject(response);
};

// Error interceptor
export const errorInterceptor = (error: any) => {
  // Handle network errors
  if (!error.response) {
    console.error("Network error:", error.message);
  }

  // Handle specific error cases
  if (error.response?.data?.message) {
    console.error("API Error:", error.response.data.message);
  }

  return Promise.reject(error);
};
