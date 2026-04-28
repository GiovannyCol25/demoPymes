import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth() {
  const { authed } = useAuth();
  const loc = useLocation();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: loc.pathname || "/" }} />;
  }

  return <Outlet />;
}
