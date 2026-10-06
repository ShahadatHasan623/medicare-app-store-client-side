import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  FaBars, FaTimes, FaCartPlus, FaHome, FaStore, FaThLarge,
  FaQuestionCircle, FaInfoCircle, FaTachometerAlt, FaUserEdit,
  FaSignOutAlt, FaSignInAlt,
} from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";
import MedicareLogo from "./logo/MedicareLogo";
import useAuth from "../hooks/useAuth";
import { useCart } from "../utils/CartContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOutUser } = useAuth();
  const { cart } = useCart();

  const isActive = (path) => location.pathname === path;

  /* 🌀 Scroll hole shadow on/off */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ⌨️ ESC diye drawer close + drawer open thakle body scroll lock */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSignOut = () => {
    if (signOutUser) signOutUser();
    Swal.fire({ title: "Logout Successfully", icon: "success", draggable: true, timer: 1500 });
    navigate("/");
    setAnchorElUser(null);
    setDrawerOpen(false);
  };

  const links = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Shop", path: "/shop", icon: <FaStore /> },
    { name: "Categories", path: "/categories", icon: <FaThLarge /> },
    { name: "FAQ", path: "/faq-list", icon: <FaQuestionCircle /> },
    { name: "About", path: "/about-page", icon: <FaInfoCircle /> },
    user ? { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> } : null,
  ].filter(Boolean);

  return (
    <>
      <header className="sticky top-0 z-50 ">
        {/* 🌈 Top gradient accent line */}
        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

        <nav
          className={`bg-[var(--color-primary)] text-white border-b border-white/10 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "shadow-2xl shadow-black/30" : "shadow-md"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            {/* Logo + Drawer Button */}
            <div className="flex items-center gap-3">
              <button
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <FaBars className="text-lg" />
              </button>
              <MedicareLogo />
            </div>

            {/* Desktop Links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "bg-[var(--color-secondary)] shadow-lg shadow-black/20"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                        className={`text-[13px] transition-colors duration-300 ${
                          active ? "text-emerald-200" : "text-white/50 group-hover:text-emerald-300"
                        }`}
                      >
                        {link.icon}
                      </span>
                      {link.name}
                      {/* Animated underline (hover e) */}
                      <span
                        className={`pointer-events-none absolute inset-x-3 bottom-1 h-[2.5px] origin-center rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-transform duration-300 ${
                          active ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Icons */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle />

              {/* 🛒 Cart — glass button + ping badge */}
              <Link to="/cart" aria-label="Cart" className="group relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20 active:scale-95">
                  <FaCartPlus className="text-lg" />
                </div>
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow">
                      {cart.length > 99 ? "99+" : cart.length}
                    </span>
                  </span>
                )}
              </Link>

              <LanguageSelector />

              {/* 👤 User Avatar */}
              {user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0.5 }}
                      className="!transition-transform hover:scale-105"
                    >
                      <Avatar
                        alt={user?.displayName || "User"}
                        src={user?.photoURL || "https://i.ibb.co/0y7VvYb/default-avatar.png"}
                        sx={{
                          width: 38, height: 38,
                          border: "2px solid rgba(255,255,255,0.7)",
                          "&:hover": { boxShadow: "0 0 0 4px rgba(52, 211, 153, 0.4)" },
                          transition: "box-shadow .3s",
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          mt: 1.5, minWidth: 250, borderRadius: 3, overflow: "visible",
                          boxShadow: "0 24px 48px -12px rgba(2, 44, 34, 0.35)",
                          "&:before": {
                            content: '""', display: "block", position: "absolute",
                            top: 0, right: 16, width: 10, height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)", zIndex: 0,
                          },
                        },
                      },
                    }}
                  >
                    {/* 🪪 User info header */}
                    <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <Avatar
                        src={user?.photoURL || "https://i.ibb.co/0y7VvYb/default-avatar.png"}
                        sx={{ width: 42, height: 42, bgcolor: "primary.main", fontSize: 16, fontWeight: 700 }}
                      >
                        {user?.displayName?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontSize={14} fontWeight={700} noWrap>
                          {user?.displayName || "User"}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary" noWrap>
                          {user?.email}
                        </Typography>
                      </Box>
                    </Box>

                    <MenuItem
                      onClick={() => { navigate("/update-profile"); handleCloseUserMenu(); }}
                      disableRipple
                      sx={{ gap: 1.5, py: 1.2, mt: 0.5, fontSize: 14 }}
                    >
                      <FaUserEdit className="text-emerald-600" /> Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => { navigate("/dashboard"); handleCloseUserMenu(); }}
                      disableRipple
                      sx={{ gap: 1.5, py: 1.2, fontSize: 14 }}
                    >
                      <FaTachometerAlt className="text-emerald-600" /> Dashboard
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      onClick={handleSignOut}
                      disableRipple
                      sx={{ gap: 1.5, py: 1.2, mb: 0.5, fontSize: 14, color: "error.main" }}
                    >
                      <FaSignOutAlt /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/50 active:scale-95"
                >
                  <FaSignInAlt className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
                  Join Us
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* 📱 Mobile Drawer — fade overlay + slide panel */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-[var(--color-primary)] text-white shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <MedicareLogo />
            <button
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 transition hover:bg-white/20 hover:rotate-90 duration-300"
            >
              <FaTimes />
            </button>
          </div>

          {/* 👤 User Card */}
          {user && (
            <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
              <Avatar
                src={user?.photoURL || "https://i.ibb.co/0y7VvYb/default-avatar.png"}
                sx={{ width: 44, height: 44, border: "2px solid rgba(255,255,255,0.6)" }}
              >
                {user?.displayName?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user?.displayName || "User"}</p>
                <p className="truncate text-xs text-white/60">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-1.5">
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-[var(--color-secondary)] shadow-md"
                          : "hover:bg-white/10 hover:pl-5"
                      }`}
                    >
                      <span className={`text-base ${active ? "text-emerald-300" : "text-white/50"}`}>
                        {link.icon}
                      </span>
                      {link.name}
                      {active && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-emerald-300" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Drawer Footer — Auth Buttons */}
          <div className="border-t border-white/10 p-4">
            {user ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { navigate("/update-profile"); setDrawerOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 text-sm font-bold shadow-md transition hover:shadow-lg active:scale-95"
                >
                  <FaUserEdit /> Profile
                </button>
                <button
                  onClick={() => { navigate("/dashboard"); setDrawerOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-bold shadow-md transition hover:shadow-lg active:scale-95"
                >
                  <FaTachometerAlt /> Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 py-2.5 text-sm font-bold shadow-md transition hover:shadow-lg active:scale-95"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-bold shadow-md transition hover:shadow-lg active:scale-95"
              >
                <FaSignInAlt /> Join Us
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;