// src/routes/SellerRoute.jsx
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";



export default function SellerRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <span>Loading...</span>;
  if (user && role === "seller") return children;

  return <Navigate to="/" replace />;
}
