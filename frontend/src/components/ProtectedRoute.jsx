import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking auth
  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Logged in
  return children;
}
