import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, isLoadingRole } = useRole();

  if (loading || isLoadingRole) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }


  if (user && role === "admin") {
    return children;
  }


  return <Navigate  replace />;
}
