"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "@/lib/api";
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  checkSecurityContext,
} from "@/lib/auth-security";
import type { AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    full_name: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      // Check security context on app start
      checkSecurityContext();

      const token = getAuthToken(); // Uses secure token retrieval
      if (token) {
        try {
          const response = await authApi.me();
          setState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          removeAuthToken(); // Secure cleanup
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { user, access_token } = response.data;

      setAuthToken(access_token); // Secure token storage
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      router.push("/dashboard");
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.response?.data?.message || "Giriş başarısız";
      throw new Error(message);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    full_name: string,
  ) => {
    try {
      const response = await authApi.register({
        email,
        username,
        password,
        full_name,
      });
      const { user, access_token } = response.data;

      setAuthToken(access_token); // Secure token storage
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      router.push("/dashboard");
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.response?.data?.message || "Kayıt işlemi başarısız";
      throw new Error(message);
    }
  };

  const logout = () => {
    removeAuthToken(); // Secure token removal
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
