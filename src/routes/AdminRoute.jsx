import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";


export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, isLoadingRole } = useRole();

  if (loading || isLoadingRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-purple-600"></span>
      </div>
    );
  }
  if(loading){
    return "loading";
  }

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/" replace />;
}
