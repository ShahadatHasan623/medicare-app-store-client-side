import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaCartPlus, FaBars } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import { useCart } from "../utils/CartContext";
import LanguageSelector from "./LanguageSelector";
import Swal from "sweetalert2";
import MedicareLogo from "./logo/MedicareLogo";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    signOutUser();
    Swal.fire({
      title: "Logout Successfully",
      icon: "success",
      draggable: true,
    });
    navigate("/");
    setDrawerOpen(false);
  };

  const links = (
    <>
      <li>
        <Link
          to="/"
          onClick={() => setDrawerOpen(false)}
          className={`relative px-4 py-2 rounded-md font-medium transition-all duration-300
          ${
            isActive("/")
              ? "bg-[var(--color-secondary)] text-white shadow-md"
              : "text-[var(--navbar-text)] hover:bg-[var(--color-primary)] hover:text-white"
          }
        `}
        >
          {t("home")}
          <span
            className={`absolute bottom-0 left-0 h-1 w-full rounded-full bg-[var(--color-accent)] transition-transform duration-300
            ${
              isActive("/")
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100"
            }`}
          ></span>
        </Link>
      </li>

      <li>
        <Link
          to="/shop"
          onClick={() => setDrawerOpen(false)}
          className={`relative px-4 py-2 rounded-md font-medium transition-all duration-300
          ${
            isActive("/shop")
              ? "bg-[var(--color-secondary)] text-white shadow-md"
              : "text-[var(--navbar-text)] hover:bg-[var(--color-primary)] hover:text-white"
          }
        `}
        >
          {t("shop")}
          <span
            className={`absolute bottom-0 left-0 h-1 w-full rounded-full bg-[var(--color-accent)] transition-transform duration-300
            ${
              isActive("/shop")
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100"
            }`}
          ></span>
        </Link>
      </li>

      <li>
        <Link
          to="/Categories"
          onClick={() => setDrawerOpen(false)}
          className={`relative px-4 py-2 rounded-md font-medium transition-all duration-300
          ${
            isActive("/Categories")
              ? "bg-[var(--color-secondary)] text-white shadow-md"
              : "text-[var(--navbar-text)] hover:bg-[var(--color-primary)] hover:text-white"
          }
        `}
        >
          {t("categories")}
          <span
            className={`absolute bottom-0 left-0 h-1 w-full rounded-full bg-[var(--color-accent)] transition-transform duration-300
            ${
              isActive("/Categories")
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100"
            }`}
          ></span>
        </Link>
      </li>

      {user && (
        <li>
          <Link
            to="/dashboard"
            onClick={() => setDrawerOpen(false)}
            className={`relative px-4 py-2 rounded-md font-medium transition-all duration-300
            ${
              isActive("/dashboard")
                ? "bg-[var(--color-secondary)] text-white shadow-md"
                : "text-[var(--navbar-text)] hover:bg-[var(--color-primary)] hover:text-white"
            }
          `}
          >
            {t("dashboard")}
            <span
              className={`absolute bottom-0 left-0 h-1 w-full rounded-full bg-[var(--color-accent)] transition-transform duration-300
              ${
                isActive("/dashboard")
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              }`}
            ></span>
          </Link>
        </li>
      )}
    </>
  );

  return (
    <>
      {/* Top Navbar */}
      <div
        className="navbar bg-primary text-white shadow-md px-4 sticky top-0 z-50"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {/* Left Side */}
        <div className="navbar-start flex items-center gap-3">
          {/* Drawer Button for Mobile */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-primary-focus"
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars className="text-xl" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <MedicareLogo />
          </div>
        </div>

        {/* Center Links (Only for Desktop) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium">{links}</ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-3 flex items-center">
          {/* Cart Icon */}
          <Link to="/cart" className="relative group">
            <div className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out shadow-md">
              <FaCartPlus className="text-xl" />
            </div>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Language Selector */}
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>

          {/* Auth Buttons */}
          {!user ? (
            <Link
              to="/login"
              className="btn bg-secondary text-white border-none hover:shadow-2xl transition-all duration-300"
            >
              {t("joinUs")}
            </Link>
          ) : (
            <div className="hidden lg:block dropdown dropdown-end">
              <label
                tabIndex={0}
                className="cursor-pointer flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--color-secondary)] transition duration-300"
              >
                <img
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co/0y7VvYb/default-avatar.png"
                  }
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border-2 border-gray-300 shadow-sm hover:shadow-md"
                />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content mt-3 p-3 shadow-lg bg-white rounded-xl w-60 border border-gray-200 text-gray-700 z-[1000]"
              >
                <li>
                  <Link
                    to="/update-profile"
                    className="block px-4 py-3 text-lg hover:bg-[var(--color-primary)] hover:text-white rounded-md transition-colors duration-300"
                  >
                    {t("updateProfile")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-lg hover:bg-[var(--color-primary)] hover:text-white rounded-md transition-colors duration-300"
                  >
                    {t("dashboard")}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 text-lg hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300"
                  >
                    {t("logout")}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Drawer (Mobile Menu) */}
      <div
        className={`fixed inset-0 bg-opacity-40 z-50 transition-transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className="absolute right-0 top-0 w-64 h-full bg-primary text-white p-5 shadow-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Section */}
          {user && (
            <div className="flex items-center gap-3 mb-6">
              <img
                src={
                  user?.photoURL ||
                  "https://i.ibb.co/0y7VvYb/default-avatar.png"
                }
                alt="User"
                className="h-12 w-12 rounded-full border-2 border-white"
              />
              <div>
                <p className="font-semibold">{user?.displayName || "User"}</p>
                <p className="text-sm opacity-80">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Menu Links */}
          <ul className="menu flex flex-col gap-3 mb-5">{links}</ul>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Auth Buttons */}
          {!user ? (
            <Link
              to="/login"
              onClick={() => setDrawerOpen(false)}
              className="btn mt-5 bg-secondary border-none text-white"
            >
              {t("joinUs")}
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="btn mt-5 bg-red-500 border-none text-white"
            >
              {t("logout")}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
