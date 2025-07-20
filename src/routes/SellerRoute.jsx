// src/routes/SellerRoute.jsx
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";


export default function SellerRoute({ children }) {
  const { user, loading } = useAuth();
  const { role} = useRole();

  if (loading) {
    return "....loading";
  }

  if (user && role === "seller") {
    return children;
  }

  return <Navigate to="/" replace />; // ❗ যদি seller না হয়, home এ পাঠিয়ে দাও
}
