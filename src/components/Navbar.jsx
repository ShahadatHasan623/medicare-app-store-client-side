import React from "react";
import { Link, useLocation, useNavigate } from "react-router"; 
import { FaCartPlus } from "react-icons/fa";
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

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    signOutUser();
    Swal.fire({
      title: "Logout Successfully",
      icon: "success",
      draggable: true,
    });
    navigate("/");
  };

  const links = (
    <>
      <li>
        <Link
          to="/"
          className={
            isActive("/")
              ? "text-orange-500 font-semibold border-b-2 border-orange-500"
              : "text-white hover:text-purple-300 transition-colors duration-300"
          }
        >
          {t("home")}
        </Link>
      </li>
      <li>
        <Link
          to="/shop"
          className={
            isActive("/shop")
              ? "text-orange-500 font-semibold border-b-2 border-orange-500"
              : "text-white hover:text-purple-300 transition-colors duration-300"
          }
        >
          {t("shop")}
        </Link>
      </li>
      <li>
        <Link
          to="/Categories"
          className={
            isActive("/Categories")
              ? "text-orange-500 font-semibold border-b-2 border-orange-500"
              : "text-white hover:text-purple-300 transition-colors duration-300"
          }
        >
          {t("categories")}
        </Link>
      </li>
    </>
  );

  return (
    <div
      className="navbar bg-primary poppins text-white shadow-md px-4 sticky top-0 z-50"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-blue-5 rounded-box w-52 "
          >
            {links}
          </ul>
        </div>

        {/* Logo */}
        <div  className="flex items-center">
          <MedicareLogo /> 
        </div>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">{links}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-3 flex items-center">
        {/* Cart Icon with badge */}
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

        {/* Language Selector Component */}
        <LanguageSelector />

        {/* Auth Buttons */}
        {!user ? (
          <Link
            to="/login"
            className="btn shadow-2xl bg-[var(--color-primary)] text-white border-none hover:bg-[var(--color-secondary)] transition-all duration-300 hover:shadow-2xl"
          >
            {t("joinUs")}
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
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
              className="dropdown-content mt-3 p-3 shadow-lg bg-white rounded-xl w-60 border border-gray-200 text-gray-700 z-[1000] animate-fadeIn"
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
  );
};

export default Navbar;
