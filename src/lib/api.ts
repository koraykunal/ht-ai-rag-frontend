import axios from "axios";
import type {
  ApiResponse,
  ChangePasswordCredentials,
  LoginCredentials,
  RagQueryRequest,
  RagQueryResponse,
  RegisterCredentials,
  User,
} from "@/types";
import { getAuthToken, removeAuthToken } from "./auth-security";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken(); // Uses secure token retrieval with validation
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (typeof window !== 'undefined' && localStorage.getItem("auth-token")) {
    // Token was invalid/expired and removed by getAuthToken()
    window.location.href = "/login";
    return Promise.reject(new Error("Token expired or invalid"));
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken(); // Secure token cleanup
      // Clear any sensitive data from memory
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
    
    // Log security-relevant errors (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.message);
    }
    
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<{ access_token: string; user: User }>("/auth/login", credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<{ access_token: string; user: User }>(
      "/auth/register",
      credentials,
    ),

  me: () => api.get<User>("/auth/me"),

  changePassword: (credentials: ChangePasswordCredentials) =>
    api.post<{ message: string }>("/auth/change-password", credentials),
};

export const ragApi = {
  ask: (request: RagQueryRequest) =>
    api.post<RagQueryResponse>("/ask", request),
};
