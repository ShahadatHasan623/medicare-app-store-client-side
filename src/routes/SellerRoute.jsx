// src/routes/SellerRoute.jsx
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";

export default function SellerRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, isLoadingRole } = useRole(); 

  if (loading || isLoadingRole) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }


  if (user && role === "seller") {
    return children;
  }


  return <Navigate  replace />;
}
