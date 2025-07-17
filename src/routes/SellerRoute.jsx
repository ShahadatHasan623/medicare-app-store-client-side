// src/routes/SellerRoute.jsx
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";


export default function SellerRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, isLoadingRole } = useRole();

  if (loading || isLoadingRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-purple-600"></span>
      </div>
    );
  }

  if (user && role === "seller") {
    return children;
  }

  return <Navigate to="/" replace />; // ❗ যদি seller না হয়, home এ পাঠিয়ে দাও
}
