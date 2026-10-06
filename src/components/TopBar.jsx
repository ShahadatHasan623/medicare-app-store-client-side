import React from "react";
import {
  FaPhoneAlt, FaEnvelope, FaTruck,
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
} from "react-icons/fa";
import NavbarClock from "./NavbarClock";

const TopBar = () => {
  const socials = [
    { icon: FaFacebookF, label: "Facebook", hover: "hover:bg-[#1877F2]" },
    { icon: FaTwitter, label: "Twitter", hover: "hover:bg-[#1DA1F2]" },
    { icon: FaLinkedinIn, label: "LinkedIn", hover: "hover:bg-[#0A66C2]" },
    { icon: FaInstagram, label: "Instagram", hover: "hover:bg-[#E4405F]" },
  ];

  return (
    <div className="relative w-full select-none bg-slate-900 text-white">
   
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* 📞 Left: contact info — ছোট স্ক্রিনে tagline */}
        <div className="flex min-w-0 items-center gap-3 text-[11px] font-medium text-white/60">
          <span className="hidden items-center gap-1.5 sm:flex">
            <FaPhoneAlt className="text-[9px] text-emerald-400" />
            +880 1XXX-XXXXXX
          </span>
          <span className="hidden h-3 w-px bg-white/15 sm:block" />
          <span className="hidden items-center gap-1.5 lg:flex">
            <FaEnvelope className="text-[9px] text-emerald-400" />
            support@medicare.com
          </span>
          {/* Mobile fallback tagline */}
          <span className="truncate font-semibold tracking-wide text-emerald-300 sm:hidden">
            Your Health, Our Priority
          </span>
        </div>

        {/* 🚚 Center: delivery notice — বড় স্ক্রিনে */}
        <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-white/50 md:flex">
          <FaTruck className="animate-pulse text-[10px] text-cyan-400" />
          Free delivery on orders over ৳500
        </span>

        {/* 🔗 Right: socials + clock */}
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 sm:flex">
            {socials.map(({ icon: Icon, label, hover }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                title={label}
                className={`grid h-6 w-6 place-items-center rounded-full bg-white/5 text-[10px] text-white/60 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:text-white active:scale-95 ${hover}`}
              >
                <Icon />
              </a>
            ))}
          </div>

          <span className="hidden h-4 w-px bg-white/15 sm:block" />

          {/* 🕐 Navbar Clock */}
          <NavbarClock />
        </div>
      </div>
    </div>
  );
};

export default TopBar;