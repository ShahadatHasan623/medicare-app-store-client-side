
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaCartPlus, FaBars } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import MedicareLogo from "./logo/MedicareLogo";
import useAuth from "../hooks/useAuth";
import { useCart } from "../utils/CartContext"; // ✅ Context import

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, signOutUser } = useAuth();
  const { cart } = useCart(); // ✅ Context cart

  const isActive = (path) => location.pathname === path;

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSignOut = () => {
    if (signOutUser) signOutUser();
    Swal.fire({ title: "Logout Successfully", icon: "success", draggable: true });
    navigate("/");
    setAnchorElUser(null);
    setDrawerOpen(false);
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "FAQ", path: "/faq-list" },
    user ? { name: "Dashboard", path: "/dashboard" } : null,
  ].filter(Boolean);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[var(--color-primary)] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center  h-16">
          {/* Logo + Drawer Button */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-green-700 transition"
              onClick={() => setDrawerOpen(true)}
            >
              <FaBars className="text-xl" />
            </button>
            <MedicareLogo />
          </div>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-4 font-medium">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-4 py-2 rounded-md transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-[var(--color-secondary)] shadow-md"
                      : "hover:bg-[var(--navbar-hover)] hover:text-white"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-1 w-full rounded-full bg-[var(--color-accent)] transition-transform duration-300 ${
                      isActive(link.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <div className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-md">
                <FaCartPlus className="text-xl" />
              </div>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.displayName || "User"}
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/0y7VvYb/default-avatar.png"
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/update-profile");
                      handleCloseUserMenu();
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleCloseUserMenu();
                    }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Link
                to="/login"
                className="btn bg-secondary text-white border-none hover:shadow-xl transition"
              >
                Join Us
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className="absolute right-0 top-0 w-64 h-full bg-[var(--color-primary)] text-white p-5 shadow-lg flex flex-col transition-transform"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Links */}
          <ul className="flex flex-col gap-3 mt-5">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="block px-4 py-3 rounded-md hover:bg-[var(--navbar-hover)] transition"
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* User / Auth Buttons */}
          <div className="mt-auto">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/update-profile");
                    setDrawerOpen(false);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-md py-2 mb-2 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setDrawerOpen(false);
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 rounded-md py-2 mb-2 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 rounded-md py-2 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="w-full block bg-secondary text-white rounded-md py-2 text-center hover:shadow-lg transition"
              >
                Join Us
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
