import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import {
  FaHome,
  FaUser,
  FaPills,
  FaMoneyBill,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRole } from "../hooks/useRool";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import MedicareLogo from "../components/logo/MedicareLogo";
import { ReTitle } from "re-title";

const drawerWidth = 260;

export default function DashboardLayout() {
  const { user, signOutUser } = useAuth();
  const { role, isLoadingRole } = useRole();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (isLoadingRole) {
    return <Loader />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = () => {
    signOutUser();
    Swal.fire({
      title: "Logout Successfully",
      icon: "success",
      draggable: true,
    });
    navigate("/");
  };

  // Sidebar Links by Role
  const renderLinks = () => {
    switch (role) {
      case "admin":
        return [
          { to: "/dashboard/admin-home", icon: <FaHome />, label: "Admin Home" },
          { to: "/dashboard/manage-users", icon: <FaUser />, label: "Manage Users" },
          { to: "/dashboard/manage-category", icon: <FaClipboardList />, label: "Manage Categories" },
          { to: "/dashboard/payments", icon: <FaMoneyBill />, label: "Payment Management" },
          { to: "/dashboard/sales-report", icon: <FaClipboardList />, label: "Sales Report" },
          { to: "/dashboard/manage-banner", icon: <FaPills />, label: "Manage Banners" },
          { to: "/dashboard/Faq-from", label: "FAQ" },
        ];
      case "seller":
        return [
          { to: "/dashboard/seller-home", icon: <FaHome />, label: "Seller Dashboard" },
          { to: "/dashboard/my-medicines", icon: <FaPills />, label: "Manage Medicines" },
          { to: "/dashboard/payment-history", icon: <FaMoneyBill />, label: "Payment History" },
          { to: "/dashboard/advertise-request", icon: <FaClipboardList />, label: "Ask for Advertisement" },
        ];
      case "user":
        return [{ to: "/dashboard/user-payments", icon: <FaMoneyBill />, label: "My Payment History" }];
      default:
        return [];
    }
  };

  // Sidebar Component
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "var(--color-surface)" }}>
      {/* Sidebar Header */}
      <Box sx={{ textAlign: "center", p: 2 }}>
        <MedicareLogo />
        <Typography variant="body2" sx={{ color: "var(--color-muted)" }}>
          Welcome, <b>{role}</b>!
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "var(--color-border)" }} />

      {/* Sidebar Links */}
      <List sx={{ flex: 1, px: 2 }}>
        {renderLinks().map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "#fff" : "var(--color-text)",
                  "&:hover": {
                    bgcolor: "var(--navbar-hover)",
                    color: "#fff",
                  },
                }}
              >
                {link.icon && (
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 36,
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={link.label} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ borderColor: "var(--color-border)" }} />

      {/* Sidebar Footer */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FaHome />}
          component={Link}
          to="/"
          sx={{
            mb: 1,
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
            "&:hover": {
              bgcolor: "var(--navbar-hover)",
              borderColor: "var(--color-primary)",
              color: "#fff",
            },
          }}
        >
          Back to Home
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<FaSignOutAlt />}
          onClick={handleSignOut}
          sx={{
            bgcolor: "var(--color-error)",
            "&:hover": { bgcolor: "#dc2626" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <ReTitle title="Medicare | Dashboard" />

      {/* ✅ Top Navbar only for mobile */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "var(--navbar-bg)",
          color: "var(--navbar-text)",
          boxShadow: 1,
          display: { xs: "block", lg: "none" }, // hide in desktop
        }}
      >
        <Toolbar>
          {/* Sidebar Toggle (Mobile) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <MedicareLogo />
          </Box>

          {/* User Avatar */}
          <Avatar
            src={user?.photoURL || "/user.png"}
            alt={user?.displayName || "User"}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid var(--color-primary)",
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "var(--color-surface)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: 8, lg: 0 }, // mobile এ topbar height এর জায়গা রাখবে
          minHeight: "100vh",
          bgcolor: "var(--color-bg)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
