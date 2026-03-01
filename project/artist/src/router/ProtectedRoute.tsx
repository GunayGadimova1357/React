import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { JSX } from "react/jsx-runtime";

export function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
