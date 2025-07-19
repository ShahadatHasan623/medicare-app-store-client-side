import { Outlet, NavLink, Link } from "react-router";
import {
  FaHome,
  FaUser,
  FaPills,
  FaMoneyBill,
  FaClipboardList,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { role, isLoadingRole } = useRole();

  if (isLoadingRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  const renderLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <SidebarLink to="/dashboard" icon={<FaHome />} label="Admin Home" />
            <SidebarLink to="/dashboard/manage-users" icon={<FaUser />} label="Manage Users" />
            <SidebarLink to="/dashboard/manage-category" icon={<FaClipboardList />} label="Manage Categories" />
            <SidebarLink to="/dashboard/payments" icon={<FaMoneyBill />} label="Payment Management" />
            <SidebarLink to="/dashboard/sales-report" icon={<FaClipboardList />} label="Sales Report" />
            <SidebarLink to="/dashboard/manage-banner" icon={<FaPills />} label="Manage Banners" />
          </>
        );
      case "seller":
        return (
          <>
            <SidebarLink to="/dashboard/my-medicines" icon={<FaPills />} label="Manage Medicines" />
            <SidebarLink to="/dashboard/payment-history" icon={<FaMoneyBill />} label="Payment History" />
            <SidebarLink to="/dashboard/advertise-request" icon={<FaClipboardList />} label="Ask for Advertisement" />
          </>
        );
      case "user":
        return (
          <>
            <SidebarLink to="/dashboard/user-payments" icon={<FaMoneyBill />} label="My Payment History" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Topbar */}
        <div className="navbar bg-white shadow-md sticky top-0 z-50 lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
              title="Open sidebar"
            >
              <FaBars size={22} />
            </label>
          </div>
          <div className="flex-1 px-4 text-xl font-bold text-primary">Dashboard</div>
          <div className="flex-none">
            <img
              src={user?.photoURL || "/user.png"}
              alt={user?.displayName || "User"}
              title={user?.displayName || "User"}
              className="w-10 h-10 rounded-full border border-primary object-cover"
            />
          </div>
        </div>

        {/* Content Outlet */}
        <main className="p-6 flex-1 overflow-auto"><Outlet /></main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side border-r border-base-300 bg-white">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-72 flex flex-col justify-between min-h-screen">
          <div>
            {/* Header */}
            <div className="p-6 border-b border-base-300 text-center">
              <h2 className="text-3xl font-extrabold text-primary">Dashboard</h2>
              <p className="mt-1 text-sm text-gray-500 capitalize">
                Welcome, <span className="font-semibold">{role}</span>!
              </p>
            </div>

            {/* Navigation Links */}
            <ul className="menu p-4 space-y-2">
              {renderLinks()}
            </ul>
          </div>

          {/* Footer with logout & home */}
          <div className="p-4 border-t border-base-300 space-y-3">
            <Link
              to="/"
              className="btn btn-outline btn-primary w-full flex items-center justify-center gap-2"
            >
              <FaHome /> Back to Home
            </Link>

            <button
              onClick={() => logout()}
              className="btn btn-error w-full flex items-center justify-center gap-2"
              title="Logout"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// SidebarLink component with exact active match for home route
function SidebarLink({ to, icon, label }) {
  // Home route should be exact match only (end prop true)
  const isExact = to === "/dashboard";

  return (
    <li>
      <NavLink
        to={to}
        end={isExact}  // <-- This makes '/dashboard' active only on exact match
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer
          ${
            isActive
              ? "bg-primary text-primary-content font-semibold shadow-md"
              : "text-base-content hover:bg-primary hover:text-primary-content"
          }`
        }
      >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
