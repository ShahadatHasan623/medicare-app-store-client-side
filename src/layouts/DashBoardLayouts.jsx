import { Outlet, Link } from "react-router";
import {
  FaHome,
  FaUser,
  FaPills,
  FaMoneyBill,
  FaClipboardList,
  FaBars,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function DashboardLayout() {
  const { user, role } = useAuth();

  return (
    <div className="drawer drawer-mobile lg:drawer-open">
      {/* Drawer Toggle for Mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white shadow-md flex justify-between items-center px-4 py-3 sticky top-0 z-20 w-full lg:hidden">
          {/* Toggle Button for Mobile */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost drawer-button lg:hidden text-xl"
          >
            <FaBars />
          </label>

          {/* Page Title */}
          <h2 className="text-base md:text-xl font-semibold text-purple-800">
            Dashboard
          </h2>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <img
              src={user?.photoURL || "/user.png"}
              alt="User"
              className="w-9 h-9 rounded-full border object-cover"
            />
            <span className="hidden sm:inline text-sm md:text-base font-medium text-gray-700">
              {user?.displayName || "User"}
            </span>
          </div>
        </div>

        {/* Page Body */}
        <div className="p-4 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-30">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-72 bg-white h-full border-r flex flex-col justify-between">
          {/* Sidebar Menu */}
          <div className="p-4">
            <h2 className="text-xl font-bold text-center text-purple-700 mb-4">
              Dashboard Menu
            </h2>
            <ul className="space-y-2 text-[16px] font-medium">
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-purple-700 transition">
                  <FaHome /> Home
                </Link>
              </li>

              {/* Admin Menu */}
              {role === "admin" && (
                <>
                  <li><Link to="/dashboard/manage-users"><FaUser /> Manage Users</Link></li>
                  <li><Link to="/dashboard/manage-category"><FaClipboardList /> Manage Categories</Link></li>
                  <li><Link to="/dashboard/payments"><FaMoneyBill /> Payment Management</Link></li>
                  <li><Link to="/dashboard/sales-report"><FaClipboardList /> Sales Report</Link></li>
                  <li><Link to="/dashboard/manage-banner"><FaPills /> Manage Banners</Link></li>
                </>
              )}

              {/* Seller Menu */}
              {role === "seller" && (
                <>
                  <li><Link to="/dashboard/my-medicines"><FaPills /> Manage Medicines</Link></li>
                  <li><Link to="/dashboard/payment-history"><FaMoneyBill /> Payment History</Link></li>
                  <li><Link to="/dashboard/advertise-request"><FaClipboardList /> Ask for Advertisement</Link></li>
                </>
              )}

              {/* User Menu */}
              {role === "user" && (
                <li>
                  <Link to="/dashboard/user-payments"><FaMoneyBill /> My Payment History</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Back to Home */}
          <div className="p-4 border-t">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-purple-700 font-semibold hover:text-purple-900 transition"
            >
              <FaHome /> Back to Home
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
