import React, { useEffect, useRef, useState } from "react";
import { FiGlobe, FiCheck, FiChevronDown } from "react-icons/fi";
import i18nInstance from "../../src/components/i18nInstance"

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(i18nInstance.resolvedLanguage || "en");
  const dropdownRef = useRef(null);

  // 🔄 language change listen kori — re-render ensure kore
  useEffect(() => {
    const onLangChange = (lng) => setLang(lng);
    i18nInstance.on("languageChanged", onLangChange);
    return () => i18nInstance.off("languageChanged", onLangChange);
  }, []);

  const currentLang =
    LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const changeLanguage = (code) => {
    i18nInstance.changeLanguage(code); // ✅ ekhon guaranteed function
    setOpen(false);
  };

  /* 🖱️ Baiyer click + ESC e close */
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative select-none">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Select Language"
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-white ring-1 ring-white/20 backdrop-blur transition-all duration-300 hover:bg-white/20 hover:ring-emerald-300/50 active:scale-95"
      >
        <FiGlobe className={`text-base text-emerald-300 transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
        <span className="text-xs font-bold tracking-wide">{currentLang.code.toUpperCase()}</span>
        <FiChevronDown className={`text-xs text-white/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute right-0 top-12 z-50 w-40 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        <p className="border-b border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Language
        </p>
        <ul className="p-1.5">
          {LANGUAGES.map((l) => {
            const active = l.code === currentLang.code;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => changeLanguage(l.code)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  {l.label}
                  {active && (
                    <span className="ml-auto flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <FiCheck className="text-emerald-400" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;