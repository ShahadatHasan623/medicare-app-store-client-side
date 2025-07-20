import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";


export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { role} = useRole();
  
  if(loading){
    return "loading";
  }

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/" replace />;
}
