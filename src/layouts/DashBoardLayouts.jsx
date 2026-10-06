import React, { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import {
  FaHome, FaUser, FaPills, FaMoneyBill, FaClipboardList,
  FaSignOutAlt, FaQuestionCircle, FaChevronRight, FaAd,
} from "react-icons/fa";
import {
  AppBar, Toolbar, IconButton, Avatar, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText, Box, Divider,
  Button, Typography, Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRole } from "../hooks/useRool";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import MedicareLogo from "../components/logo/MedicareLogo";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const drawerWidth = 280;

export default function DashboardLayout() {
  const { user, signOutUser } = useAuth();
  const { role, isLoadingRole } = useRole();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* 🏅 Role label — existing flat keys reuse */
  const roleLabel =
    role === "admin" ? t("roleAdmin")
    : role === "seller" ? t("roleSeller")
    : t("roleUser");

  if (isLoadingRole) {
    return <Loader />;
  }

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleSignOut = () => {
    signOutUser();
    Swal.fire({
      title: t("logoutSuccess"),
      icon: "success",
      draggable: true,
      timer: 1500,
      timerProgressBar: true,
    });
    navigate("/");
  };

  /* 🔗 Sidebar links by role — ✅ flat keys, no dash. prefix */
  const getLinks = () => {
    switch (role) {
      case "admin":
        return [
          { to: "/dashboard/admin-home", icon: <FaHome />, label: t("adminHome") },
          { to: "/dashboard/manage-users", icon: <FaUser />, label: t("manageUsers") },
          { to: "/dashboard/manage-category", icon: <FaClipboardList />, label: t("manageCategories") },
          { to: "/dashboard/payments", icon: <FaMoneyBill />, label: t("payments") },
          { to: "/dashboard/sales-report", icon: <FaClipboardList />, label: t("salesReport") },
          { to: "/dashboard/manage-banner", icon: <FaAd />, label: t("manageBanners") },
          { to: "/dashboard/Faq-from", icon: <FaQuestionCircle />, label: t("manageFaq") },
        ];
      case "seller":
        return [
          { to: "/dashboard/seller-home", icon: <FaHome />, label: t("sellerHome") },
          { to: "/dashboard/my-medicines", icon: <FaPills />, label: t("myMedicines") },
          { to: "/dashboard/payment-history", icon: <FaMoneyBill />, label: t("paymentHistory") },
          { to: "/dashboard/advertise-request", icon: <FaAd />, label: t("advertise") },
        ];
      case "user":
        return [
          { to: "/dashboard/user-payments", icon: <FaMoneyBill />, label: t("myPayments") },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  /* 🎨 Sidebar content */
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "var(--color-surface)",
      }}
    >
      {/* 🌈 Top gradient strip */}
      <Box sx={{ height: 3, background: "linear-gradient(90deg,#10b981,#2dd4bf,#22d3ee)" }} />

      {/* Header — logo + role chip */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <MedicareLogo compact />
        <Box sx={{ mt: 1.25 }}>
          <Chip
            size="small"
            label={roleLabel}
            sx={{
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: 1,
              color: "#fff",
              background:
                role === "admin"
                  ? "linear-gradient(90deg,#f43f5e,#ef4444)"
                  : role === "seller"
                  ? "linear-gradient(90deg,#10b981,#14b8a6)"
                  : "linear-gradient(90deg,#3b82f6,#6366f1)",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: "var(--color-border)", mt: 1 }} />

      {/* 👤 User card */}
      <Box
        sx={{
          mx: 1.5, mt: 1.5, p: 1.5, display: "flex", alignItems: "center", gap: 1.5,
          borderRadius: 3,
          bgcolor: "rgba(16,185,129,.07)",
          border: "1px solid rgba(16,185,129,.18)",
        }}
      >
        <Avatar
          src={user?.photoURL || "/user.png"}
          alt={user?.displayName || "User"}
          sx={{ width: 40, height: 40, border: "2px solid rgba(16,185,129,.5)" }}
        >
          {user?.displayName?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)" }}>
            {user?.displayName || "User"}
          </Typography>
          <Typography noWrap sx={{ fontSize: 11, color: "var(--color-muted)" }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {/* 📌 Menu label */}
      <Typography
        sx={{
          px: 3, mt: 2, mb: 0.5, fontSize: 10, fontWeight: 800,
          letterSpacing: 2, textTransform: "uppercase",
          color: "var(--color-muted)",
        }}
      >
        {t("menu")}
      </Typography>

      {/* 🔗 Links */}
      <List sx={{ flex: 1, px: 1.5, overflowY: "auto" }}>
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  position: "relative",
                  overflow: "hidden",
                  background: isActive
                    ? "linear-gradient(135deg,#10b981,#14b8a6)"
                    : "transparent",
                  color: isActive ? "#fff" : "var(--color-text)",
                  boxShadow: isActive ? "0 8px 16px -6px rgba(16,185,129,.45)" : "none",
                  transition: "all .25s ease",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(135deg,#10b981,#14b8a6)"
                      : "rgba(16,185,129,.08)",
                    color: isActive ? "#fff" : "#0f766e",
                    transform: "translateX(3px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <Box
                    sx={{
                      display: "grid", placeItems: "center",
                      width: 30, height: 30, borderRadius: 1.5, fontSize: 13,
                      background: isActive ? "rgba(255,255,255,.22)" : "rgba(16,185,129,.12)",
                      color: isActive ? "#fff" : "#10b981",
                      transition: "all .25s ease",
                    }}
                  >
                    {link.icon}
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontSize: 13.5, fontWeight: isActive ? 700 : 600 }}
                />

                {isActive && (
                  <FaChevronRight style={{ fontSize: 11, opacity: 0.85 }} />
                )}
              </ListItemButton>
            )}
          </NavLink>
        ))}

        {/* No access fallback */}
        {links.length === 0 && (
          <Typography sx={{ px: 2, py: 3, fontSize: 12.5, color: "var(--color-muted)", textAlign: "center" }}>
            {t("noAccess")}
          </Typography>
        )}
      </List>

      <Divider sx={{ borderColor: "var(--color-border)" }} />

      {/* Footer buttons */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<FaHome />}
          component={Link}
          to="/"
          sx={{
            mb: 1,
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            color: "var(--color-primary)",
            border: "1.5px solid rgba(16,185,129,.35)",
            "&:hover": {
              background: "linear-gradient(135deg,#10b981,#14b8a6)",
              borderColor: "transparent",
              color: "#fff",
            },
          }}
        >
          {t("backHome")}
        </Button>
        <Button
          fullWidth
          startIcon={<FaSignOutAlt />}
          onClick={handleSignOut}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            color: "#fff",
            background: "linear-gradient(135deg,#f43f5e,#ef4444)",
            boxShadow: "0 8px 16px -6px rgba(239,68,68,.4)",
            "&:hover": {
              background: "linear-gradient(135deg,#e11d48,#dc2626)",
              boxShadow: "0 10px 20px -6px rgba(239,68,68,.5)",
            },
          }}
        >
          {t("logout")}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--color-bg)" }}>
      {/* ✅ renamed key — dashboardDocTitle */}
      <ReTitle title={t("dashboardDocTitle")} />

      {/* 📱 Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "var(--navbar-bg)",
          color: "var(--navbar-text)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,.08)",
          display: { xs: "block", lg: "none" },
        }}
      >
        <Box sx={{ height: 3, background: "linear-gradient(90deg,#10b981,#2dd4bf,#22d3ee)" }} />
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              bgcolor: "rgba(255,255,255,.1)",
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,.2)" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <MedicareLogo compact />
          </Box>

          <Avatar
            src={user?.photoURL || "/user.png"}
            alt={user?.displayName || "User"}
            sx={{
              width: 38, height: 38,
              border: "2px solid rgba(16,185,129,.6)",
              boxShadow: "0 0 0 3px rgba(16,185,129,.15)",
            }}
          >
            {user?.displayName?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawers */}
      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              borderRight: "none",
              boxShadow: "8px 0 24px rgba(0,0,0,.1)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "var(--color-surface)",
              borderRight: "1px solid var(--color-border)",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* 📄 Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: "60px", sm: "68px", lg: 0 },
          minHeight: "100vh",
          bgcolor: "var(--color-bg)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}