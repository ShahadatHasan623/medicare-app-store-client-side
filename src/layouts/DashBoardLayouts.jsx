import { Outlet, NavLink, Link } from "react-router";
import {
  FaHome,
  FaUser,
  FaPills,
  FaMoneyBill,
  FaClipboardList,
  FaBars,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useRole } from "../hooks/useRool";

export default function DashboardLayout() {
  const { user } = useAuth();
  const { role, isLoadingRole } = useRole();

  if (isLoadingRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-purple-600"></span>
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
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Mobile Topbar */}
        <div className="bg-white shadow flex justify-between items-center p-4 sticky top-0 z-50 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button text-xl">
            <FaBars />
          </label>
          <h2 className="text-xl font-bold text-purple-700">Dashboard</h2>
          <div className="flex items-center gap-2">
            <img
              src={user?.photoURL || "/user.png"}
              alt="User"
              className="w-9 h-9 rounded-full border object-cover"
            />
          </div>
        </div>

        <div className="p-4 flex-1 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-72 h-full bg-white border-r flex flex-col justify-between">
          <div className="overflow-y-auto px-4 py-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-purple-700">Dashboard</h2>
              <p className="text-sm text-gray-600 capitalize">Welcome, {role}!</p>
            </div>
            <ul className="space-y-2 text-[16px] font-medium">{renderLinks()}</ul>
          </div>
          <div className="p-4 border-t">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-purple-700 font-semibold hover:text-purple-900"
            >
              <FaHome /> Back to Home
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ✅ Reusable Sidebar Link Component
function SidebarLink({ to, icon, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-md transition ${
            isActive
              ? "bg-purple-100 text-purple-800 font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`
        }
      >
        {icon} {label}
      </NavLink>
    </li>
  );
}
