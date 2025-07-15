
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";



export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <span>Loading...</span>;
  if (user && role === "admin") return children;

  return <Navigate to="/" replace />;
}
