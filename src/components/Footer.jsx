import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import MedicareLogo from "./logo/MedicareLogo";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & About */}
        <div>
          <MedicareLogo></MedicareLogo>
          <p className="text-sm text-gray-200 leading-relaxed">
            Your trusted partner in healthcare. We provide genuine medicines, 
            health tips, and expert guidance for a better life.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="#"
              className="p-2 bg-white text-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 bg-white text-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 bg-white text-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 bg-white text-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-200 text-sm">
            <li><Link href="/" className="hover:text-[var(--color-secondary)]">Home</Link ></li>
            <li><Link  href="/shop" className="hover:text-[var(--color-secondary)]">Shop</Link ></li>
            <li><Link  href="/categories" className="hover:text-[var(--color-secondary)]">Categories</Link ></li>
            <li><Link  href="#" className="hover:text-[var(--color-secondary)]">About Us</Link ></li>
            <li><a href="#" className="hover:text-[var(--color-secondary)]">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-200 text-sm">
            <li><a href="#" className="hover:text-[var(--color-secondary)]">FAQ</a></li>
            <li><a href="#y" className="hover:text-[var(--color-secondary)]">Privacy Policy</a></li>
            <li><Link  to="/terms" className="hover:text-[var(--color-secondary)]">Terms & Conditions</Link ></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center gap-2 text-gray-200 text-sm">
            <FaPhoneAlt /> +880 1234 567 890
          </p>
          <p className="flex items-center gap-2 text-gray-200 text-sm mt-2">
            <FaEnvelope /> support@medicare.com
          </p>
          <p className="flex items-center gap-2 text-gray-200 text-sm mt-2">
            <FaMapMarkerAlt /> Dhaka, Bangladesh
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-300 text-sm mt-8 border-t border-gray-600 pt-4">
        © {new Date().getFullYear()} MediCare. All Rights Reserved.
      </div>
    </footer>
  );
}
