import { Link } from "react-router";
import useRole from "../../Role/useRole";
 

export default function SidebarMenu({ user }) {
  const role = useRole(user?.email); 

  return (
    <ul className="menu p-4 w-72 bg-base-200 text-base-content">
      <h2 className="text-lg font-bold mb-4">Dashboard ({role})</h2>

      {/* Admin Routes */}
      {role === "admin" && (
        <>
          <li><Link to="/dashboard/admin/home">Admin Home</Link></li>
          <li><Link to="/dashboard/admin/users">Manage Users</Link></li>
          <li><Link to="/dashboard/admin/category">Manage Category</Link></li>
          <li><Link to="/dashboard/admin/payments">Manage Payments</Link></li>
          <li><Link to="/dashboard/admin/sales">Sales Report</Link></li>
          <li><Link to="/dashboard/admin/advertise">Manage Advertise</Link></li>
        </>
      )}

      {/* Seller Routes */}
      {role === "seller" && (
        <>
          <li><Link to="/dashboard/seller/home">Seller Home</Link></li>
          <li><Link to="/dashboard/seller/medicines">Manage Medicines</Link></li>
          <li><Link to="/dashboard/seller/ads">Ask for Advertise</Link></li>
          <li><Link to="/dashboard/seller/payments">Payment History</Link></li>
        </>
      )}

      {/* User Routes */}
      {role === "user" && (
        <>
          <li><Link to="/dashboard/user/home">User Home</Link></li>
          <li><Link to="/dashboard/user/orders">My Orders</Link></li>
          <li><Link to="/dashboard/user/payments">Payment History</Link></li>
        </>
      )}

      <div className="divider" />
      <li><Link to="/">Back to Home</Link></li>
    </ul>
  );
}
