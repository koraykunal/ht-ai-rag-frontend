"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: "free" | "premium" | "admin";
  roleRedirectTo?: string;
}

export function AuthGuard({ 
  children, 
  redirectTo = "/login", 
  requiredRole, 
  roleRedirectTo = "/dashboard" 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push(roleRedirectTo);
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, requiredRole, roleRedirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}