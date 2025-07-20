import React from "react";
import { Link } from "react-router";
import { FaCartPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useCart } from "../utils/CartContext";


const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const { cart } = useCart();
  console.log(cart)

  const handleSignOut = () => {
    signOutUser();
  };

  const links = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/shop">Shop</Link>
      </li>
      <li>
        <Link to="/Categories">Categories</Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky z-50 top-0">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[2] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {links}
          </ul>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold text-purple-700"
        >
          MediStore
        </Link>
      </div>

      {/* Navbar Center (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">{links}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-2">
        {/* Cart Icon with badge */}
        <Link to="/cart" className="relative group">
          <div className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out shadow-md">
            <FaCartPlus className="text-xl" />
          </div>
       
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
             {cart.length}
            </span>
          
        </Link>

        {/* Language Selector */}
        <select className="border border-gray-300 rounded p-1 text-sm">
          <option>EN</option>
          <option>BN</option>
        </select>

        {/* Auth Buttons */}
        {!user ? (
          <Link to="/login" className="btn btn-sm btn-primary">
            Join Us
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="cursor-pointer">
              <img
                src={
                  user?.photoURL ||
                  "https://i.ibb.co/0y7VvYb/default-avatar.png"
                }
                alt="User Avatar"
                className="h-10 w-10 rounded-full border"
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content mt-3 z-[2] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/update-profile">Update Profile</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={handleSignOut}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
