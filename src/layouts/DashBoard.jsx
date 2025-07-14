import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import SidebarMenu from "../pages/sideBarMenu/SidebarMenu";


const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-4">
        {/* Page Content Here */}
        <Outlet />
      </div>
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <SidebarMenu user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
