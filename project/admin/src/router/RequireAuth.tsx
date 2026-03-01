import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth";

type Props = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
