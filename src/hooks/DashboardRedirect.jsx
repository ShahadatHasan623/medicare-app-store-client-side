import { Navigate } from "react-router";
import { useRole } from "./useRool";

export default function DashboardRedirect() {
  const { role, isLoadingRole } = useRole();

  if (isLoadingRole || !role) return <div>Loading...</div>;

  if (role === "admin") return <Navigate to="/dashboard/admin-home" replace />;
  if (role === "seller")
    return <Navigate to="/dashboard/seller-home" replace />;
  if (role === "user")
    return <Navigate to="/dashboard/user-payments" replace />;
  return;
}
