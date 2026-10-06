import React, { useState } from "react";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane,
  FaApple, FaGooglePlay, FaCcVisa, FaCcMastercard, FaCcPaypal,
  FaCcStripe, FaArrowUp, FaClock,
} from "react-icons/fa";
import MedicareLogo from "./logo/MedicareLogo";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return;
    }
    // 📮 ekhane backend call korte paren
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const quickLinks = [
    { name: t("home"), path: "/" },
    { name: t("shop"), path: "/shop" },
    { name: t("categories"), path: "/categories" },
    { name: t("about"), path: "/about-page" },
  ];

  const supportLinks = [
    { name: t("faq"), path: "/faq-list" },
    { name: t("privacyPolicy"), path: "/privacy" },
    { name: t("termsConditions"), path: "/terms" },
  ];

  const socials = [
    { icon: <FaFacebookF />, name: "Facebook", hover: "hover:bg-[#1877F2]" },
    { icon: <FaTwitter />, name: "Twitter", hover: "hover:bg-[#1DA1F2]" },
    { icon: <FaInstagram />, name: "Instagram", hover: "hover:bg-[#E4405F]" },
    { icon: <FaLinkedin />, name: "LinkedIn", hover: "hover:bg-[#0A66C2]" },
    { icon: <FaYoutube />, name: "YouTube", hover: "hover:bg-[#FF0000]" },
  ];

  const contacts = [
    { icon: <FaPhoneAlt />, label: "+880 1234 567 890", href: "tel:+8801234567890" },
    { icon: <FaEnvelope />, label: "support@medicare.com", href: "mailto:support@medicare.com" },
    { icon: <FaMapMarkerAlt />, label: "Dhaka, Bangladesh", href: null },
    { icon: <FaClock />, label: "Sat–Thu, 9AM–9PM", href: null },
  ];

  return (
    <>
      <style>{`
        @keyframes footer-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .footer-fade-up { animation: footer-fade-up .6s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <footer className="relative mt-16 overflow-hidden bg-[var(--color-primary)] text-white">
        {/* 🌈 Top gradient border */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        {/* 🌫️ Decorative blobs */}
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="footer-fade-up relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
            {/* ================= 🏥 Brand & About ================= */}
            <div className="lg:col-span-4">
              <MedicareLogo />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
                {t("footerAbout")}
              </p>

              {/* 💌 Mini newsletter */}
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                {t("stayConnected")}
              </p>
              <form onSubmit={handleSubscribe} className="mt-3 flex max-w-xs gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholderFooter")}
                  className="w-full min-w-0 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur transition-all duration-300 focus:border-emerald-400 focus:bg-white/15"
                  aria-label={t("emailPlaceholderFooter")}
                />
                <button
                  type="submit"
                  className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95 ${
                    subscribed
                      ? "bg-emerald-400 text-emerald-950"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  }`}
                  aria-label={t("subscribeFooter")}
                >
                  {subscribed ? "✓" : <FaPaperPlane className="text-xs" />}
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs font-bold text-emerald-300">
                  {t("subscribedFooter")}
                </p>
              )}

              {/* 📱 App badges */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10"
                  aria-label="Download on App Store"
                >
                  <FaApple className="text-xl" />
                  <span className="text-left leading-none">
                    <span className="block text-[8px] text-white/60">Download on the</span>
                    <span className="block text-xs font-bold">App Store</span>
                  </span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10"
                  aria-label="Get it on Google Play"
                >
                  <FaGooglePlay className="text-lg text-emerald-300" />
                  <span className="text-left leading-none">
                    <span className="block text-[8px] text-white/60">Get it on</span>
                    <span className="block text-xs font-bold">Google Play</span>
                  </span>
                </a>
              </div>
            </div>

            {/* ================= 🔗 Quick Links ================= */}
            <div className="lg:col-span-2">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                {t("quickLinks")}
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-2 text-sm text-white/65 transition-all duration-300 hover:translate-x-1 hover:text-emerald-300"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-400/50 transition-all duration-300 group-hover:w-3 group-hover:bg-emerald-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ================= 🛟 Support ================= */}
            <div className="lg:col-span-2">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                {t("support")}
              </h3>
              <ul className="space-y-2.5">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-2 text-sm text-white/65 transition-all duration-300 hover:translate-x-1 hover:text-emerald-300"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-400/50 transition-all duration-300 group-hover:w-3 group-hover:bg-emerald-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ================= 📞 Contact ================= */}
            <div className="lg:col-span-4">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                {t("contactHeading")}
              </h3>
              <ul className="space-y-3.5">
                {contacts.map((c, i) => (
                  <li key={i}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="group inline-flex items-center gap-3 text-sm text-white/65 transition-colors duration-300 hover:text-emerald-300"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/8 text-emerald-300 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                          {c.icon}
                        </span>
                        {c.label}
                      </a>
                    ) : (
                      <span className="group inline-flex items-center gap-3 text-sm text-white/65">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/8 text-emerald-300 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                          {c.icon}
                        </span>
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* 💳 Payment methods */}
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                {t("paymentMethods")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe].map((Icon, i) => (
                  <span
                    key={i}
                    className="grid h-9 w-12 place-items-center rounded-lg bg-white/8 text-xl text-white/70 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-slate-900"
                  >
                    <Icon />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================= 📱 Social icons ================= */}
          <div className="mt-12 flex justify-center gap-3 lg:hidden">
            {socials.map((s) => (
              <a
                key={s.name}
                href="#"
                aria-label={s.name}
                title={s.name}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/70 ring-1 ring-white/15 transition-all duration-300 hover:scale-110 hover:text-white ${s.hover}`}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* ================= ⬆️ Bottom bar ================= */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-center text-xs text-white/50 sm:text-sm">
              © {new Date().getFullYear()} MediCare. {t("allRightsReserved")}
            </p>

            {/* 💚 Crafted with */}
            <p className="text-xs text-white/40">
              {t("madeWith")}
            </p>

            {/* ⬆️ Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/70 ring-1 ring-white/15 transition-all duration-300 hover:bg-emerald-500 hover:text-white active:scale-95"
              aria-label="Back to top"
            >
              {t("goToShop")?.length ? "Top" : "Top"}
              <FaArrowUp className="text-[10px] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}